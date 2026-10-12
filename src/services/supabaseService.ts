// ==============================================================================
// Concerned Citizens of PE Metro - Supabase Sync & Persistence Service
// ==============================================================================

import { supabase, isSupabaseConfigured } from '../lib/supabase';
import {
  CommunityIssue,
  CommunityPost,
  CrimeSafetyNotice,
  CommunityWorkItem,
  CommunityStats,
  LeadershipMember,
  Supporter,
  GalleryItem,
  OrgSettings,
} from '../types';

export interface SupabaseStatus {
  isConfigured: boolean;
  isConnected: boolean;
  urlPreview?: string;
  message: string;
}

/**
 * Checks whether Supabase environment variables are provided and
 * tests connection to the database.
 */
export async function testSupabaseConnection(): Promise<SupabaseStatus> {
  if (!isSupabaseConfigured) {
    return {
      isConfigured: false,
      isConnected: false,
      message: 'Supabase URL and API Key are not set in environment variables. The portal is currently running safely in Local Storage mode.',
    };
  }

  try {
    const rawUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim() || '';
    const maskedUrl = rawUrl.replace(/(https?:\/\/)([^.]+)(.*)/, '$1$2***$3');

    // Test query against issues or settings
    const { error } = await supabase
      .from('community_issues')
      .select('count', { count: 'exact', head: true });

    if (error) {
      // If table doesn't exist yet, we still know credentials connected to Supabase
      if (error.code === '42P01') {
        return {
          isConfigured: true,
          isConnected: true,
          urlPreview: maskedUrl,
          message: 'Connected to Supabase! The tables have not been created yet. Please execute supabase/schema.sql in your Supabase SQL editor.',
        };
      }
      return {
        isConfigured: true,
        isConnected: false,
        urlPreview: maskedUrl,
        message: `Supabase responded with: ${error.message} (Code: ${error.code})`,
      };
    }

    return {
      isConfigured: true,
      isConnected: true,
      urlPreview: maskedUrl,
      message: 'Successfully connected to Supabase Cloud Database! Real-time persistence is active.',
    };
  } catch (err: any) {
    return {
      isConfigured: true,
      isConnected: false,
      message: `Failed to connect to Supabase: ${err.message || 'Unknown network error'}`,
    };
  }
}

/**
 * Upload a community issue to Supabase
 */
export async function pushIssueToSupabase(issue: CommunityIssue): Promise<boolean> {
  if (!isSupabaseConfigured) return false;
  try {
    const { error } = await supabase.from('community_issues').upsert({
      reference_number: issue.reference_number,
      title: issue.title,
      description: issue.description,
      category: issue.category,
      location: issue.location,
      suburb: issue.suburb,
      ward: issue.ward || null,
      urgency: issue.urgency,
      status: issue.status,
      reporter_name: issue.reporter_name,
      reporter_contact: issue.reporter_contact,
      images: issue.images || [],
      admin_notes: issue.admin_notes || null,
      assigned_team: issue.assigned_team || null,
      timeline: issue.timeline || [],
    }, { onConflict: 'reference_number' });

    if (error) {
      console.warn('[Supabase] Failed to save issue:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('[Supabase] Error uploading issue:', err);
    return false;
  }
}

/**
 * Fetch issues from Supabase
 */
export async function fetchIssuesFromSupabase(): Promise<CommunityIssue[] | null> {
  if (!isSupabaseConfigured) return null;
  try {
    const { data, error } = await supabase
      .from('community_issues')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data) return null;

    return data.map((row: any) => ({
      id: row.id,
      reference_number: row.reference_number,
      title: row.title,
      description: row.description,
      category: row.category,
      location: row.location,
      suburb: row.suburb,
      ward: row.ward,
      urgency: row.urgency,
      status: row.status,
      reporter_name: row.reporter_name,
      reporter_contact: row.reporter_contact,
      images: row.images || [],
      created_at: row.created_at,
      updated_at: row.updated_at,
      admin_notes: row.admin_notes,
      assigned_team: row.assigned_team,
      timeline: row.timeline || [],
    }));
  } catch {
    return null;
  }
}

/**
 * Export and sync all local state data to Supabase (1-click seeding/migration)
 */
export async function seedLocalDataToSupabase(data: {
  issues?: CommunityIssue[];
  posts?: CommunityPost[];
  safetyNotices?: CrimeSafetyNotice[];
  communityWork?: CommunityWorkItem[];
  leadership?: LeadershipMember[];
  supporters?: Supporter[];
  gallery?: GalleryItem[];
  stats?: CommunityStats;
  settings?: OrgSettings;
}): Promise<{ success: boolean; syncedCount: number; errors: string[] }> {
  if (!isSupabaseConfigured) {
    return {
      success: false,
      syncedCount: 0,
      errors: ['Supabase environment variables (VITE_SUPABASE_URL and key) are not configured.'],
    };
  }

  let count = 0;
  const errors: string[] = [];

  // 1. Sync Issues
  if (data.issues && data.issues.length > 0) {
    for (const issue of data.issues) {
      const ok = await pushIssueToSupabase(issue);
      if (ok) count++;
      else errors.push(`Issue ${issue.reference_number} failed to sync.`);
    }
  }

  // 2. Sync Posts
  if (data.posts && data.posts.length > 0) {
    for (const post of data.posts) {
      try {
        const { error } = await supabase.from('community_posts').upsert({
          title: post.title,
          content: post.content,
          author: post.author,
          author_role: post.author_role || null,
          author_avatar: post.author_avatar || null,
          category: post.category,
          images: post.images || [],
          likes: post.likes || 0,
          liked_by: post.liked_by || [],
          comments_count: post.comments_count || 0,
          comments: post.comments || [],
          location: post.location || null,
          area: post.area || null,
          is_pinned: Boolean(post.is_pinned),
          source: post.source || 'direct',
          facebook_post_url: post.facebook_post_url || null,
          facebook_post_id: post.facebook_post_id || null,
        });
        if (!error) count++;
        else errors.push(`Post "${post.title.slice(0, 20)}..." failed: ${error.message}`);
      } catch (e: any) {
        errors.push(`Post error: ${e.message}`);
      }
    }
  }

  // 3. Sync Safety Notices
  if (data.safetyNotices && data.safetyNotices.length > 0) {
    for (const notice of data.safetyNotices) {
      try {
        const { error } = await supabase.from('crime_safety_notices').insert({
          title: notice.title,
          description: notice.description,
          area: notice.area,
          alert_level: notice.alert_level,
          category: notice.category,
          date: notice.date,
          action_required: notice.action_required || null,
          contact_person: notice.contact_person || null,
          emergency_numbers: notice.emergency_numbers || [],
        });
        if (!error) count++;
        else errors.push(`Notice "${notice.title.slice(0, 20)}..." failed: ${error.message}`);
      } catch (e: any) {
        errors.push(`Notice error: ${e.message}`);
      }
    }
  }

  // 4. Sync Community Work
  if (data.communityWork && data.communityWork.length > 0) {
    for (const work of data.communityWork) {
      try {
        const { error } = await supabase.from('community_work').insert({
          title: work.title,
          description: work.description,
          category: work.category,
          date: work.date,
          location: work.location,
          impact_stat: work.impact_stat,
          images: work.images || [],
          organizer: work.organizer,
          volunteers_count: work.volunteers_count || 0,
        });
        if (!error) count++;
        else errors.push(`Community work "${work.title.slice(0, 20)}..." failed: ${error.message}`);
      } catch (e: any) {
        errors.push(`Work error: ${e.message}`);
      }
    }
  }

  // 5. Sync Stats
  if (data.stats) {
    try {
      const { error } = await supabase.from('community_stats').upsert({
        id: 'current',
        issues_resolved: data.stats.issues_resolved,
        families_fed: data.stats.families_fed,
        water_litres_distributed: data.stats.water_litres_distributed,
        active_patrols: data.stats.active_patrols,
        cleanups_conducted: data.stats.cleanups_conducted,
        community_volunteers: data.stats.community_volunteers,
      });
      if (!error) count++;
      else errors.push(`Stats sync failed: ${error.message}`);
    } catch (e: any) {
      errors.push(`Stats error: ${e.message}`);
    }
  }

  return {
    success: errors.length === 0,
    syncedCount: count,
    errors,
  };
}
