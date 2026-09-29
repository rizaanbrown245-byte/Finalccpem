-- ==============================================================================
-- AI YouTube Manager - Stage 1 Supabase Database Schema
-- Compatible with PostgreSQL 14+ / Supabase
-- ==============================================================================

-- Enable UUID extension if not enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- 2. FACEBOOK PAGES TABLE
CREATE TABLE IF NOT EXISTS public.facebook_pages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  facebook_page_id TEXT NOT NULL,
  page_name TEXT NOT NULL,
  access_token_reference TEXT, -- Stored securely (reference or encrypted ID, never exposed to client)
  connected BOOLEAN DEFAULT true NOT NULL,
  last_synced_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  CONSTRAINT unique_profile_facebook_page UNIQUE (profile_id, facebook_page_id)
);

CREATE INDEX IF NOT EXISTS idx_facebook_pages_profile_id ON public.facebook_pages(profile_id);
CREATE INDEX IF NOT EXISTS idx_facebook_pages_fb_id ON public.facebook_pages(facebook_page_id);

ALTER TABLE public.facebook_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own facebook pages"
  ON public.facebook_pages FOR ALL
  USING (auth.uid() = profile_id);

-- 3. FACEBOOK POSTS TABLE
CREATE TABLE IF NOT EXISTS public.facebook_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facebook_page_id UUID REFERENCES public.facebook_pages(id) ON DELETE CASCADE,
  facebook_post_id TEXT NOT NULL,
  post_text TEXT,
  post_url TEXT,
  media_url TEXT,
  media_type TEXT DEFAULT 'status' NOT NULL CHECK (media_type IN ('image', 'video', 'link', 'status')),
  published_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ,
  engagement_data JSONB DEFAULT '{"likes": 0, "comments": 0, "shares": 0}'::JSONB,
  processed BOOLEAN DEFAULT false NOT NULL,
  is_demo BOOLEAN DEFAULT false NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  CONSTRAINT unique_page_post UNIQUE (facebook_page_id, facebook_post_id)
);

CREATE INDEX IF NOT EXISTS idx_facebook_posts_page_id ON public.facebook_posts(facebook_page_id);
CREATE INDEX IF NOT EXISTS idx_facebook_posts_published_at ON public.facebook_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_facebook_posts_processed ON public.facebook_posts(processed);

ALTER TABLE public.facebook_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own facebook posts"
  ON public.facebook_posts FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.facebook_pages
      WHERE public.facebook_pages.id = public.facebook_posts.facebook_page_id
      AND public.facebook_pages.profile_id = auth.uid()
    )
  );

-- 4. AI ANALYSIS TABLE
CREATE TABLE IF NOT EXISTS public.ai_analysis (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facebook_post_id UUID REFERENCES public.facebook_posts(id) ON DELETE CASCADE NOT NULL,
  main_topic TEXT NOT NULL,
  summary TEXT NOT NULL,
  important_facts JSONB DEFAULT '[]'::JSONB NOT NULL,
  entities JSONB DEFAULT '{"names": [], "places": [], "dates": [], "events": [], "products_or_services": []}'::JSONB NOT NULL,
  key_messages JSONB DEFAULT '[]'::JSONB NOT NULL,
  potential_story_angles JSONB DEFAULT '[]'::JSONB NOT NULL,
  potential_youtube_angles JSONB DEFAULT '[]'::JSONB NOT NULL,
  potential_short_angles JSONB DEFAULT '[]'::JSONB NOT NULL,
  verification_required BOOLEAN DEFAULT false NOT NULL,
  verification_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  CONSTRAINT unique_post_ai_analysis UNIQUE (facebook_post_id)
);

CREATE INDEX IF NOT EXISTS idx_ai_analysis_post_id ON public.ai_analysis(facebook_post_id);

ALTER TABLE public.ai_analysis ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can access ai analysis for their posts"
  ON public.ai_analysis FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.facebook_posts
      JOIN public.facebook_pages ON public.facebook_pages.id = public.facebook_posts.facebook_page_id
      WHERE public.facebook_posts.id = public.ai_analysis.facebook_post_id
      AND public.facebook_pages.profile_id = auth.uid()
    )
  );

-- 5. CONTENT IDEAS TABLE
CREATE TABLE IF NOT EXISTS public.content_ideas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  facebook_post_id UUID REFERENCES public.facebook_posts(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('YouTube Video', 'YouTube Short', 'Explainer', 'Educational', 'News-style', 'Story', 'Top-list format')),
  hook TEXT NOT NULL,
  description TEXT NOT NULL,
  target_audience TEXT NOT NULL,
  suggested_duration TEXT NOT NULL,
  script_status TEXT DEFAULT 'NONE' NOT NULL CHECK (script_status IN ('NONE', 'DRAFT', 'READY')),
  approval_status TEXT DEFAULT 'AWAITING_APPROVAL' NOT NULL CHECK (approval_status IN ('AWAITING_APPROVAL', 'APPROVED', 'REJECTED', 'EDITED')),
  verification_required BOOLEAN DEFAULT false NOT NULL,
  verification_status TEXT DEFAULT 'Verified against source post' NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_content_ideas_post_id ON public.content_ideas(facebook_post_id);
CREATE INDEX IF NOT EXISTS idx_content_ideas_approval_status ON public.content_ideas(approval_status);
CREATE INDEX IF NOT EXISTS idx_content_ideas_content_type ON public.content_ideas(content_type);

ALTER TABLE public.content_ideas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage content ideas for their posts"
  ON public.content_ideas FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.facebook_posts
      JOIN public.facebook_pages ON public.facebook_pages.id = public.facebook_posts.facebook_page_id
      WHERE public.facebook_posts.id = public.content_ideas.facebook_post_id
      AND public.facebook_pages.profile_id = auth.uid()
    )
  );

-- 6. APPROVALS TABLE
CREATE TABLE IF NOT EXISTS public.approvals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  content_idea_id UUID REFERENCES public.content_ideas(id) ON DELETE CASCADE NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('APPROVED', 'REJECTED', 'AWAITING_APPROVAL')),
  reviewed_by TEXT NOT NULL,
  reviewer_notes TEXT,
  reviewed_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_approvals_idea_id ON public.approvals(content_idea_id);
CREATE INDEX IF NOT EXISTS idx_approvals_status ON public.approvals(status);

ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage approvals for their content ideas"
  ON public.approvals FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.content_ideas
      JOIN public.facebook_posts ON public.facebook_posts.id = public.content_ideas.facebook_post_id
      JOIN public.facebook_pages ON public.facebook_pages.id = public.facebook_posts.facebook_page_id
      WHERE public.content_ideas.id = public.approvals.content_idea_id
      AND public.facebook_pages.profile_id = auth.uid()
    )
  );

-- 7. ACTIVITY LOGS TABLE
CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  description TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON public.activity_logs(created_at DESC);

ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read their own activity logs"
  ON public.activity_logs FOR SELECT
  USING (profile_id IS NULL OR auth.uid() = profile_id);

CREATE POLICY "Users can insert activity logs"
  ON public.activity_logs FOR INSERT
  WITH CHECK (profile_id IS NULL OR auth.uid() = profile_id);
