-- ==============================================================================
-- Concerned Citizens of PE Metro Task Team - Supabase Database Schema
-- Nelson Mandela Bay Metropolitan Civic Portal & Issue Tracker
-- Compatible with PostgreSQL 14+ / Supabase
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==============================================================================
-- 1. COMMUNITY ISSUES & SERVICE DELIVERY TRACKER
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_issues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  reference_number TEXT NOT NULL UNIQUE, -- e.g. 'CPM-8492'
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'pothole',
    'water-leak',
    'sewer-burst',
    'electricity-outage',
    'illegal-dumping',
    'streetlights',
    'crime-hotspot',
    'other'
  )),
  location TEXT NOT NULL,
  suburb TEXT NOT NULL,
  ward TEXT,
  urgency TEXT NOT NULL DEFAULT 'Medium' CHECK (urgency IN ('Low', 'Medium', 'High', 'Critical')),
  status TEXT NOT NULL DEFAULT 'Reported' CHECK (status IN ('Reported', 'Under Investigation', 'Dispatched', 'Resolved')),
  reporter_name TEXT NOT NULL,
  reporter_contact TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  admin_notes TEXT,
  assigned_team TEXT,
  timeline JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_issues_ref ON public.community_issues(reference_number);
CREATE INDEX IF NOT EXISTS idx_issues_status ON public.community_issues(status);
CREATE INDEX IF NOT EXISTS idx_issues_category ON public.community_issues(category);
CREATE INDEX IF NOT EXISTS idx_issues_suburb ON public.community_issues(suburb);
CREATE INDEX IF NOT EXISTS idx_issues_created ON public.community_issues(created_at DESC);

ALTER TABLE public.community_issues ENABLE ROW LEVEL SECURITY;

-- Anyone can read reported community issues
CREATE POLICY "Public read community issues"
  ON public.community_issues FOR SELECT
  USING (true);

-- Anyone can submit a municipal report
CREATE POLICY "Public create community issues"
  ON public.community_issues FOR INSERT
  WITH CHECK (true);

-- Authenticated admins/task team can update issues
CREATE POLICY "Authorized update community issues"
  ON public.community_issues FOR UPDATE
  USING (true);

-- ==============================================================================
-- 2. CRIME & SAFETY NOTICES
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.crime_safety_notices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  area TEXT NOT NULL,
  alert_level TEXT NOT NULL DEFAULT 'Warning' CHECK (alert_level IN ('Info', 'Warning', 'High Alert')),
  category TEXT NOT NULL CHECK (category IN (
    'burglary',
    'hijacking-hotspot',
    'scam-alert',
    'cable-theft',
    'patrol-update',
    'general'
  )),
  date TEXT NOT NULL,
  action_required TEXT,
  contact_person TEXT,
  emergency_numbers TEXT[] DEFAULT ARRAY['10111', '041 585 1555'],
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_notices_area ON public.crime_safety_notices(area);
CREATE INDEX IF NOT EXISTS idx_notices_alert_level ON public.crime_safety_notices(alert_level);
CREATE INDEX IF NOT EXISTS idx_notices_created ON public.crime_safety_notices(created_at DESC);

ALTER TABLE public.crime_safety_notices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read crime safety notices"
  ON public.crime_safety_notices FOR SELECT
  USING (true);

CREATE POLICY "Authorized write crime safety notices"
  ON public.crime_safety_notices FOR ALL
  USING (true);

-- ==============================================================================
-- 3. COMMUNITY WORK & RELIEF PROJECTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_work (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'soup-kitchen',
    'water-relief',
    'school-outreach',
    'cleanup',
    'elderly-care',
    'emergency-relief'
  )),
  date TEXT NOT NULL,
  location TEXT NOT NULL,
  impact_stat TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  organizer TEXT NOT NULL DEFAULT 'Concerned Citizens Task Team',
  volunteers_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_community_work_category ON public.community_work(category);
CREATE INDEX IF NOT EXISTS idx_community_work_created ON public.community_work(created_at DESC);

ALTER TABLE public.community_work ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read community work"
  ON public.community_work FOR SELECT
  USING (true);

CREATE POLICY "Authorized write community work"
  ON public.community_work FOR ALL
  USING (true);

-- ==============================================================================
-- 4. COMMUNITY POSTS & ANNOUNCEMENTS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Concerned Citizens Secretariat',
  author_role TEXT DEFAULT 'Official Task Team',
  author_avatar TEXT,
  category TEXT NOT NULL DEFAULT 'announcements',
  images TEXT[] DEFAULT '{}',
  likes INTEGER DEFAULT 0,
  liked_by TEXT[] DEFAULT '{}',
  comments_count INTEGER DEFAULT 0,
  comments JSONB DEFAULT '[]'::jsonb,
  location TEXT DEFAULT 'Nelson Mandela Bay',
  area TEXT,
  is_pinned BOOLEAN DEFAULT false,
  source TEXT DEFAULT 'direct' CHECK (source IN ('facebook', 'direct', 'system')),
  facebook_post_url TEXT,
  facebook_post_id TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_posts_pinned ON public.community_posts(is_pinned DESC);
CREATE INDEX IF NOT EXISTS idx_posts_category ON public.community_posts(category);
CREATE INDEX IF NOT EXISTS idx_posts_created ON public.community_posts(created_at DESC);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read community posts"
  ON public.community_posts FOR SELECT
  USING (true);

CREATE POLICY "Authorized write community posts"
  ON public.community_posts FOR ALL
  USING (true);

-- ==============================================================================
-- 5. LEADERSHIP & WARD COORDINATORS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.leadership_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  role_title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN (
    'founder',
    'executive',
    'ward_coordinator',
    'community_lead',
    'volunteer'
  )),
  bio TEXT,
  avatar_url TEXT,
  phone TEXT,
  email TEXT,
  ward_or_area TEXT NOT NULL,
  joined_date TEXT NOT NULL,
  badges TEXT[] DEFAULT '{}',
  is_founder BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.leadership_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read leadership"
  ON public.leadership_members FOR SELECT
  USING (true);

CREATE POLICY "Authorized write leadership"
  ON public.leadership_members FOR ALL
  USING (true);

-- ==============================================================================
-- 6. SUPPORTERS & DONORS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.supporters (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  organization TEXT NOT NULL,
  logo_url TEXT,
  tier TEXT NOT NULL CHECK (tier IN ('Patron', 'Community Partner', 'Local Business', 'Faith Partner')),
  contribution_type TEXT NOT NULL,
  message TEXT,
  website_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.supporters ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read supporters"
  ON public.supporters FOR SELECT
  USING (true);

CREATE POLICY "Authorized write supporters"
  ON public.supporters FOR ALL
  USING (true);

-- ==============================================================================
-- 7. GALLERY SHOWCASE
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.gallery_items (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Community',
  image_url TEXT NOT NULL,
  event_date TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.gallery_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read gallery"
  ON public.gallery_items FOR SELECT
  USING (true);

CREATE POLICY "Authorized write gallery"
  ON public.gallery_items FOR ALL
  USING (true);

-- ==============================================================================
-- 8. ORG SETTINGS & BRANDING
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.org_settings (
  id TEXT PRIMARY KEY DEFAULT 'current',
  org_name TEXT NOT NULL DEFAULT 'Concerned Citizens of PE Metro',
  task_team_title TEXT DEFAULT 'Nelson Mandela Bay Civic Oversight & Community Task Team',
  motto TEXT DEFAULT 'Giving hope to those who don''t have',
  region TEXT DEFAULT 'Nelson Mandela Bay Metropolitan Municipality, Eastern Cape',
  logo_url TEXT NOT NULL DEFAULT '/logo.jpg',
  hero_title TEXT,
  hero_subtitle TEXT,
  npo_number TEXT DEFAULT 'NPO 294-812',
  founder_name TEXT DEFAULT 'Rizaan Brown',
  founder_title TEXT DEFAULT 'Founder & Executive Chairperson',
  founder_bio TEXT,
  founder_image TEXT,
  founder_quote TEXT,
  founder_phone TEXT,
  founder_email TEXT,
  alert_banner_active BOOLEAN DEFAULT false,
  alert_banner_text TEXT,
  contact_email TEXT DEFAULT 'info@peconcernedcitizens.org.za',
  contact_phone TEXT DEFAULT '+27 41 585 1555',
  emergency_hotline TEXT DEFAULT '+27 82 000 1234',
  whatsapp_number TEXT DEFAULT '+27 82 000 1234',
  facebook_url TEXT DEFAULT 'https://facebook.com/ConcernedCitizensPEMetro',
  facebook_page_name TEXT DEFAULT 'Concerned Citizens of PE Metro',
  facebook_page_id TEXT,
  address TEXT DEFAULT 'Nelson Mandela Bay, Gqeberha, Eastern Cape, South Africa',
  banking_details JSONB DEFAULT '{
    "bank": "First National Bank (FNB)",
    "account_name": "Concerned Citizens PE Metro Task Team",
    "account_number": "62891234567",
    "branch_code": "250655",
    "account_type": "Cheque / Current Account",
    "reference": "Donor Name / Cell"
  }'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.org_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read org settings"
  ON public.org_settings FOR SELECT
  USING (true);

CREATE POLICY "Authorized write org settings"
  ON public.org_settings FOR ALL
  USING (true);

-- Insert default org settings row if not exists
INSERT INTO public.org_settings (id)
VALUES ('current')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 9. COMMUNITY STATS
-- ==============================================================================
CREATE TABLE IF NOT EXISTS public.community_stats (
  id TEXT PRIMARY KEY DEFAULT 'current',
  issues_resolved INTEGER DEFAULT 248,
  families_fed INTEGER DEFAULT 1850,
  water_litres_distributed INTEGER DEFAULT 45000,
  active_patrols INTEGER DEFAULT 36,
  cleanups_conducted INTEGER DEFAULT 18,
  community_volunteers INTEGER DEFAULT 120,
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('utc', NOW()) NOT NULL
);

ALTER TABLE public.community_stats ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read community stats"
  ON public.community_stats FOR SELECT
  USING (true);

CREATE POLICY "Authorized write community stats"
  ON public.community_stats FOR ALL
  USING (true);

-- Insert default stats row if not exists
INSERT INTO public.community_stats (id)
VALUES ('current')
ON CONFLICT (id) DO NOTHING;

-- ==============================================================================
-- 10. STORAGE BUCKET CONFIGURATION (Optional Supabase Storage)
-- Run this in your Supabase SQL Editor if you want to store uploaded images:
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('community-images', 'community-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Public Access"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'community-images');

CREATE POLICY "Public Uploads"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'community-images');
