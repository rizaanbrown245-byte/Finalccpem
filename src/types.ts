// ==============================================================================
// Concerned Citizens of PE Metro Task Team - TypeScript Types
// ==============================================================================

export type UserRole = 'admin' | 'moderator' | 'member';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar_url?: string;
  phone?: string;
  area?: string;
  joined_at: string;
}

export type LeadershipCategory =
  | 'founder'
  | 'executive'
  | 'ward_coordinator'
  | 'community_lead'
  | 'volunteer';

export interface LeadershipMember {
  id: string;
  name: string;
  role_title: string;
  category: LeadershipCategory;
  bio: string;
  avatar_url?: string;
  phone?: string;
  email?: string;
  ward_or_area: string;
  joined_date: string;
  badges?: string[];
  is_founder?: boolean;
}

export type PostCategory =
  | 'community-work'
  | 'crime-safety'
  | 'municipal'
  | 'announcements'
  | 'events'
  | 'feedback'
  | 'alert'
  | 'complaint';

export interface PostComment {
  id: string;
  author: string;
  text: string;
  created_at: string;
}

export interface CommunityPost {
  id: string;
  title: string;
  content: string;
  author: string;
  author_role?: string;
  author_avatar?: string;
  category: PostCategory;
  images: string[];
  likes: number;
  liked_by?: string[];
  comments_count: number;
  comments?: PostComment[];
  created_at: string;
  location?: string;
  area?: string;
  is_pinned?: boolean;
  source?: 'facebook' | 'direct' | 'system';
  facebook_post_url?: string;
  facebook_post_id?: string;
}

export type IssueCategory =
  | 'pothole'
  | 'water-leak'
  | 'sewer-burst'
  | 'electricity-outage'
  | 'illegal-dumping'
  | 'streetlights'
  | 'crime-hotspot'
  | 'other';

export type IssueStatus =
  | 'Reported'
  | 'Under Investigation'
  | 'Dispatched'
  | 'Resolved';

export type IssueUrgency = 'Low' | 'Medium' | 'High' | 'Critical';

export interface IssueTimelineEvent {
  status: IssueStatus;
  timestamp: string;
  note: string;
}

export interface CommunityIssue {
  id: string;
  reference_number: string; // e.g. "CPM-8492"
  title: string;
  description: string;
  category: IssueCategory;
  location: string;
  suburb: string;
  ward?: string;
  urgency: IssueUrgency;
  status: IssueStatus;
  reporter_name: string;
  reporter_contact: string;
  images: string[];
  created_at: string;
  updated_at: string;
  admin_notes?: string;
  assigned_team?: string;
  timeline: IssueTimelineEvent[];
}

export interface CrimeSafetyNotice {
  id: string;
  title: string;
  description: string;
  area: string;
  alert_level: 'Info' | 'Warning' | 'High Alert';
  category: 'burglary' | 'hijacking-hotspot' | 'scam-alert' | 'cable-theft' | 'patrol-update' | 'general';
  date: string;
  action_required?: string;
  contact_person?: string;
  emergency_numbers?: string[];
}

export interface CommunityWorkItem {
  id: string;
  title: string;
  description: string;
  category: 'soup-kitchen' | 'water-relief' | 'school-outreach' | 'cleanup' | 'elderly-care' | 'emergency-relief';
  date: string;
  location: string;
  impact_stat: string;
  images: string[];
  organizer: string;
  volunteers_count: number;
}

export interface Supporter {
  id: string;
  name: string;
  organization: string;
  logo_url?: string;
  tier: 'Patron' | 'Community Partner' | 'Local Business' | 'Faith Partner';
  contribution_type: string;
  message?: string;
  website_url?: string;
}

export interface GalleryItem {
  id: string;
  title: string;
  description: string;
  category: string;
  image_url: string;
  event_date: string;
  location: string;
}

export interface CommunityStats {
  issues_resolved: number;
  families_fed: number;
  water_litres_distributed: number;
  active_patrols: number;
  cleanups_conducted: number;
  community_volunteers: number;
}

export interface EmergencyContact {
  id: string;
  name: string;
  number: string;
  department: string;
  available: string;
  badge_color?: string;
}

export interface OrgSettings {
  org_name: string;
  task_team_title: string;
  motto: string;
  region: string;
  logo_url: string;
  hero_title?: string;
  hero_subtitle?: string;
  npo_number?: string;
  founder_name?: string;
  founder_title?: string;
  founder_bio?: string;
  founder_image?: string;
  founder_quote?: string;
  founder_phone?: string;
  founder_email?: string;
  alert_banner_active?: boolean;
  alert_banner_text?: string;
  contact_email: string;
  contact_phone: string;
  emergency_hotline: string;
  whatsapp_number: string;
  facebook_url: string;
  facebook_page_name?: string;
  facebook_page_id?: string;
  facebook_access_token?: string;
  facebook_auto_sync?: boolean;
  address: string;
  banking_details: {
    bank: string;
    account_name: string;
    account_number: string;
    branch_code: string;
    account_type: string;
    reference: string;
  };
}
