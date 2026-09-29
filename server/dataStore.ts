import {
  CommunityIssue,
  CommunityPost,
  CommunityStats,
  CommunityWorkItem,
  CrimeSafetyNotice,
  EmergencyContact,
  OrgSettings,
} from '../src/types';
import {
  EMERGENCY_CONTACTS,
  INITIAL_COMMUNITY_WORK,
  INITIAL_ISSUES,
  INITIAL_ORG_SETTINGS,
  INITIAL_POSTS,
  INITIAL_SAFETY_NOTICES,
  INITIAL_STATS,
} from '../src/data/initialData';

class CommunityDataStore {
  private issues: CommunityIssue[] = [...INITIAL_ISSUES];
  private posts: CommunityPost[] = [...INITIAL_POSTS];
  private safetyNotices: CrimeSafetyNotice[] = [...INITIAL_SAFETY_NOTICES];
  private communityWork: CommunityWorkItem[] = [...INITIAL_COMMUNITY_WORK];
  private stats: CommunityStats = { ...INITIAL_STATS };
  private settings: OrgSettings = { ...INITIAL_ORG_SETTINGS };

  // Issues
  getIssues(): CommunityIssue[] {
    return this.issues;
  }

  getIssueByRef(ref: string): CommunityIssue | undefined {
    const clean = ref.trim().toUpperCase();
    return this.issues.find(
      (i) =>
        i.reference_number.toUpperCase() === clean ||
        i.reference_number.toUpperCase() === `CPM-${clean}`
    );
  }

  createIssue(data: Partial<CommunityIssue>): CommunityIssue {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refNum = `CPM-${randomSuffix}`;
    const now = new Date().toISOString();

    const newIssue: CommunityIssue = {
      id: `issue-${Date.now()}`,
      reference_number: refNum,
      title: data.title || 'Reported Issue',
      description: data.description || '',
      category: data.category || 'other',
      location: data.location || 'Nelson Mandela Bay',
      suburb: data.suburb || 'Central PE',
      ward: data.ward,
      urgency: data.urgency || 'Medium',
      status: 'Reported',
      reporter_name: data.reporter_name || 'Anonymous Resident',
      reporter_contact: data.reporter_contact || 'Not Provided',
      images: data.images || [],
      created_at: now,
      updated_at: now,
      timeline: [
        {
          status: 'Reported',
          timestamp: new Date().toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          note: `Logged via Citizen of PE Metro Portal.`,
        },
      ],
    };

    this.issues.unshift(newIssue);
    return newIssue;
  }

  // Safety notices
  getSafetyNotices(): CrimeSafetyNotice[] {
    return this.safetyNotices;
  }

  createSafetyNotice(notice: Omit<CrimeSafetyNotice, 'id'>): CrimeSafetyNotice {
    const created: CrimeSafetyNotice = {
      ...notice,
      id: `cs-${Date.now()}`,
    };
    this.safetyNotices.unshift(created);
    return created;
  }

  // Community Work
  getCommunityWork(): CommunityWorkItem[] {
    return this.communityWork;
  }

  // Posts
  getPosts(): CommunityPost[] {
    return this.posts;
  }

  createPost(data: Partial<CommunityPost>): CommunityPost {
    const newPost: CommunityPost = {
      id: `post-${Date.now()}`,
      title: data.title || 'Community Update',
      content: data.content || '',
      author: data.author || 'Citizen of PE',
      category: data.category || 'feedback',
      area: data.area || 'Nelson Mandela Bay',
      likes: 0,
      comments_count: 0,
      created_at: new Date().toISOString(),
      images: data.images || [],
      comments: [],
    };
    this.posts.unshift(newPost);
    return newPost;
  }

  // Stats & Settings
  getStats(): CommunityStats {
    return this.stats;
  }

  getSettings(): OrgSettings {
    return this.settings;
  }

  getEmergencyContacts(): EmergencyContact[] {
    return EMERGENCY_CONTACTS;
  }
}

export const communityStore = new CommunityDataStore();
