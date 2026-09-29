import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  CommunityIssue,
  CommunityPost,
  CommunityStats,
  CommunityWorkItem,
  CrimeSafetyNotice,
  EmergencyContact,
  GalleryItem,
  IssueStatus,
  LeadershipMember,
  OrgSettings,
  Supporter,
} from '../types';
import {
  EMERGENCY_CONTACTS,
  INITIAL_COMMUNITY_WORK,
  INITIAL_GALLERY,
  INITIAL_ISSUES,
  INITIAL_LEADERSHIP,
  INITIAL_ORG_SETTINGS,
  INITIAL_POSTS,
  INITIAL_SAFETY_NOTICES,
  INITIAL_STATS,
  INITIAL_SUPPORTERS,
} from '../data/initialData';

interface AppContextType {
  posts: CommunityPost[];
  issues: CommunityIssue[];
  safetyNotices: CrimeSafetyNotice[];
  communityWork: CommunityWorkItem[];
  supporters: Supporter[];
  gallery: GalleryItem[];
  stats: CommunityStats;
  settings: OrgSettings;
  emergencyContacts: EmergencyContact[];

  // In-App Editor state
  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;
  editorActiveSection: string;
  setEditorActiveSection: (section: string) => void;

  // Issue reporting & tracking
  createIssue: (
    issue: Omit<
      CommunityIssue,
      'id' | 'reference_number' | 'created_at' | 'updated_at' | 'timeline'
    >
  ) => CommunityIssue;
  getIssueByRef: (ref: string) => CommunityIssue | undefined;
  updateIssueStatus: (
    id: string,
    status: IssueStatus,
    note?: string,
    assignedTeam?: string
  ) => void;
  updateIssue: (id: string, fields: Partial<CommunityIssue>) => void;
  deleteIssue: (id: string) => void;

  // Community posts & engagement
  createPost: (
    post: Omit<CommunityPost, 'id' | 'likes' | 'comments_count' | 'created_at'> & {
      likes?: number;
      created_at?: string;
      comments_count?: number;
    }
  ) => CommunityPost;
  updatePost: (id: string, fields: Partial<CommunityPost>) => void;
  deletePost: (id: string) => void;
  likePost: (id: string) => void;
  addComment: (postId: string, author: string, text: string) => void;

  // Safety notices
  createSafetyNotice: (notice: Omit<CrimeSafetyNotice, 'id'>) => void;
  updateSafetyNotice: (id: string, fields: Partial<CrimeSafetyNotice>) => void;
  deleteSafetyNotice: (id: string) => void;

  // Community work
  createCommunityWork: (work: Omit<CommunityWorkItem, 'id'>) => void;
  updateCommunityWork: (id: string, fields: Partial<CommunityWorkItem>) => void;
  deleteCommunityWork: (id: string) => void;

  // Supporters & Gallery
  createSupporter: (supporter: Omit<Supporter, 'id'>) => void;
  createGalleryItem: (item: Omit<GalleryItem, 'id'>) => GalleryItem;
  deleteGalleryItem: (id: string) => void;
  updateStats: (newStats: Partial<CommunityStats>) => void;
  updateSettings: (newSettings: Partial<OrgSettings>) => void;

  // Leadership & Founder Management
  leadership: LeadershipMember[];
  createLeadershipMember: (member: Omit<LeadershipMember, 'id'>) => void;
  updateLeadershipMember: (id: string, fields: Partial<LeadershipMember>) => void;
  deleteLeadershipMember: (id: string) => void;

  resetToDefaults: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const STORAGE_KEYS = {
  POSTS: 'citizen_pe_posts_v2',
  ISSUES: 'citizen_pe_issues_v2',
  NOTICES: 'citizen_pe_notices_v2',
  WORK: 'citizen_pe_work_v2',
  SUPPORTERS: 'citizen_pe_supporters_v2',
  STATS: 'citizen_pe_stats_v2',
  SETTINGS: 'citizen_pe_settings_v2',
  GALLERY: 'citizen_pe_gallery_v2',
  LEADERSHIP: 'citizen_pe_leadership_v2',
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // In-app editor open status
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editorActiveSection, setEditorActiveSection] = useState('branding');

  // Load state from localStorage or initial defaults
  const [posts, setPosts] = useState<CommunityPost[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.POSTS);
      return saved ? JSON.parse(saved) : INITIAL_POSTS;
    } catch {
      return INITIAL_POSTS;
    }
  });

  const [issues, setIssues] = useState<CommunityIssue[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ISSUES);
      return saved ? JSON.parse(saved) : INITIAL_ISSUES;
    } catch {
      return INITIAL_ISSUES;
    }
  });

  const [safetyNotices, setSafetyNotices] = useState<CrimeSafetyNotice[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTICES);
      return saved ? JSON.parse(saved) : INITIAL_SAFETY_NOTICES;
    } catch {
      return INITIAL_SAFETY_NOTICES;
    }
  });

  const [communityWork, setCommunityWork] = useState<CommunityWorkItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WORK);
      return saved ? JSON.parse(saved) : INITIAL_COMMUNITY_WORK;
    } catch {
      return INITIAL_COMMUNITY_WORK;
    }
  });

  const [supporters, setSupporters] = useState<Supporter[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SUPPORTERS);
      return saved ? JSON.parse(saved) : INITIAL_SUPPORTERS;
    } catch {
      return INITIAL_SUPPORTERS;
    }
  });

  const [gallery, setGallery] = useState<GalleryItem[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GALLERY);
      return saved ? JSON.parse(saved) : INITIAL_GALLERY;
    } catch {
      return INITIAL_GALLERY;
    }
  });

  const [stats, setStats] = useState<CommunityStats>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STATS);
      return saved ? JSON.parse(saved) : INITIAL_STATS;
    } catch {
      return INITIAL_STATS;
    }
  });

  const [settings, setSettings] = useState<OrgSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        const parsed: OrgSettings = JSON.parse(saved);
        if (!parsed.founder_name || parsed.founder_name === 'Rizaan Brown') {
          parsed.founder_name = 'Farouk Jeftha';
          parsed.founder_title = 'Movement Founder & Civil Leader';
          parsed.founder_bio = INITIAL_ORG_SETTINGS.founder_bio;
          parsed.founder_quote = INITIAL_ORG_SETTINGS.founder_quote;
        }
        return parsed;
      }
      return INITIAL_ORG_SETTINGS;
    } catch {
      return INITIAL_ORG_SETTINGS;
    }
  });

  const [leadership, setLeadership] = useState<LeadershipMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LEADERSHIP);
      if (saved) {
        let parsed: LeadershipMember[] = JSON.parse(saved);
        
        // Handle migration if Farouk was replaced or duplicated
        const founderIdx = parsed.findIndex((l) => l.is_founder || l.category === 'founder');
        if (founderIdx !== -1 && parsed[founderIdx].name === 'Rizaan Brown') {
          parsed[founderIdx] = INITIAL_LEADERSHIP[0]; // Farouk Jeftha
          if (!parsed.some((l) => l.name === 'Rizaan Brown')) {
            parsed.splice(1, 0, INITIAL_LEADERSHIP[1]); // Rizaan Brown as Director
          }
        } else if (!parsed.some((l) => l.name.toLowerCase().includes('farouk'))) {
          parsed.unshift(INITIAL_LEADERSHIP[0]);
        }

        // Deduplicate any repeated IDs or duplicate members by id and name
        const seenIds = new Set<string>();
        const seenNames = new Set<string>();
        parsed = parsed.filter((member) => {
          if (!member.id || !member.name) return false;
          if (seenIds.has(member.id) || seenNames.has(member.name.toLowerCase().trim())) {
            return false;
          }
          seenIds.add(member.id);
          seenNames.add(member.name.toLowerCase().trim());
          return true;
        });

        // Ensure Daryl Kock has lead-03-cpf if legacy lead-03 was saved
        parsed = parsed.map((m, idx) => {
          if (m.name === 'Daryl Kock' && m.id === 'lead-03') {
            return { ...m, id: 'lead-03-cpf' };
          }
          // Safety fallback: ensure unique id across all items
          return { ...m, id: m.id || `lead-${idx + 1}` };
        });

        return parsed;
      }
      return INITIAL_LEADERSHIP;
    } catch {
      return INITIAL_LEADERSHIP;
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.POSTS, JSON.stringify(posts));
    } catch (e) {
      console.warn('Failed saving posts to localStorage', e);
    }
  }, [posts]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ISSUES, JSON.stringify(issues));
    } catch (e) {
      console.warn('Failed saving issues to localStorage', e);
    }
  }, [issues]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTICES, JSON.stringify(safetyNotices));
    } catch (e) {
      console.warn('Failed saving notices to localStorage', e);
    }
  }, [safetyNotices]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.WORK, JSON.stringify(communityWork));
    } catch (e) {
      console.warn('Failed saving communityWork to localStorage', e);
    }
  }, [communityWork]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SUPPORTERS, JSON.stringify(supporters));
    } catch (e) {
      console.warn('Failed saving supporters to localStorage', e);
    }
  }, [supporters]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
    } catch (e) {
      console.warn('Failed saving stats to localStorage', e);
    }
  }, [stats]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed saving settings to localStorage', e);
    }
  }, [settings]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LEADERSHIP, JSON.stringify(leadership));
    } catch (e) {
      console.warn('Failed saving leadership to localStorage', e);
    }
  }, [leadership]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(gallery));
    } catch (e) {
      console.warn('Failed saving gallery to localStorage', e);
    }
  }, [gallery]);

  // Issue Management
  const createIssue = (
    issueData: Omit<
      CommunityIssue,
      'id' | 'reference_number' | 'created_at' | 'updated_at' | 'timeline'
    >
  ): CommunityIssue => {
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const refNum = `CPM-${randomSuffix}`;
    const now = new Date().toISOString();

    const newIssue: CommunityIssue = {
      ...issueData,
      id: `issue-${Date.now()}`,
      reference_number: refNum,
      status: 'Reported',
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
          note: `Issue officially logged via Citizen of PE Metro portal. Tracking reference generated.`,
        },
      ],
    };

    setIssues((prev) => [newIssue, ...prev]);
    return newIssue;
  };

  const getIssueByRef = (ref: string): CommunityIssue | undefined => {
    if (!ref) return undefined;
    const clean = ref.trim().toUpperCase();
    return issues.find(
      (i) =>
        i.reference_number.toUpperCase() === clean ||
        i.reference_number.toUpperCase() === `CPM-${clean}`
    );
  };

  const updateIssueStatus = (
    id: string,
    status: IssueStatus,
    note?: string,
    assignedTeam?: string
  ) => {
    setIssues((prev) =>
      prev.map((issue) => {
        if (issue.id !== id) return issue;

        const newTimeline = [...issue.timeline];
        newTimeline.unshift({
          status,
          timestamp: new Date().toLocaleDateString('en-ZA', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          }),
          note: note || `Status updated to ${status}.`,
        });

        return {
          ...issue,
          status,
          assigned_team: assignedTeam || issue.assigned_team,
          updated_at: new Date().toISOString(),
          timeline: newTimeline,
        };
      })
    );
  };

  const updateIssue = (id: string, fields: Partial<CommunityIssue>) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id ? { ...i, ...fields, updated_at: new Date().toISOString() } : i
      )
    );
  };

  const deleteIssue = (id: string) => {
    setIssues((prev) => prev.filter((i) => i.id !== id));
  };

  // Community Posts
  const createPost = (
    postData: Omit<CommunityPost, 'id' | 'likes' | 'comments_count' | 'created_at'> & {
      likes?: number;
      created_at?: string;
      comments_count?: number;
    }
  ): CommunityPost => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      likes: postData.likes ?? 0,
      comments_count: postData.comments_count ?? 0,
      created_at: postData.created_at || new Date().toISOString(),
      comments: [],
    };
    setPosts((prev) => [newPost, ...prev]);
    return newPost;
  };

  const updatePost = (id: string, fields: Partial<CommunityPost>) => {
    setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, ...fields } : p)));
  };

  const deletePost = (id: string) => {
    setPosts((prev) => prev.filter((p) => p.id !== id));
  };

  const likePost = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          return { ...post, likes: post.likes + 1 };
        }
        return post;
      })
    );
  };

  const addComment = (postId: string, author: string, text: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) return post;
        const newComment = {
          id: `comment-${Date.now()}`,
          author,
          text,
          created_at: 'Just now',
        };
        const existing = post.comments || [];
        return {
          ...post,
          comments_count: post.comments_count + 1,
          comments: [...existing, newComment],
        };
      })
    );
  };

  // Safety Notices
  const createSafetyNotice = (noticeData: Omit<CrimeSafetyNotice, 'id'>) => {
    const newNotice: CrimeSafetyNotice = {
      ...noticeData,
      id: `cs-${Date.now()}`,
    };
    setSafetyNotices((prev) => [newNotice, ...prev]);
  };

  const updateSafetyNotice = (id: string, fields: Partial<CrimeSafetyNotice>) => {
    setSafetyNotices((prev) =>
      prev.map((n) => (n.id === id ? { ...n, ...fields } : n))
    );
  };

  const deleteSafetyNotice = (id: string) => {
    setSafetyNotices((prev) => prev.filter((n) => n.id !== id));
  };

  // Community Work
  const createCommunityWork = (workData: Omit<CommunityWorkItem, 'id'>) => {
    const newWork: CommunityWorkItem = {
      ...workData,
      id: `cw-${Date.now()}`,
    };
    setCommunityWork((prev) => [newWork, ...prev]);
  };

  const updateCommunityWork = (id: string, fields: Partial<CommunityWorkItem>) => {
    setCommunityWork((prev) =>
      prev.map((w) => (w.id === id ? { ...w, ...fields } : w))
    );
  };

  const deleteCommunityWork = (id: string) => {
    setCommunityWork((prev) => prev.filter((w) => w.id !== id));
  };

  const createSupporter = (supporterData: Omit<Supporter, 'id'>) => {
    const newSup: Supporter = {
      ...supporterData,
      id: `sup-${Date.now()}`,
    };
    setSupporters((prev) => [...prev, newSup]);
  };

  const createGalleryItem = (itemData: Omit<GalleryItem, 'id'>): GalleryItem => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    };
    setGallery((prev) => [newItem, ...prev]);
    return newItem;
  };

  const deleteGalleryItem = (id: string) => {
    setGallery((prev) => prev.filter((g) => g.id !== id));
  };

  const updateStats = (newStats: Partial<CommunityStats>) => {
    setStats((prev) => ({ ...prev, ...newStats }));
  };

  const updateSettings = (newSettings: Partial<OrgSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  // Leadership & Founder Management
  const createLeadershipMember = (memberData: Omit<LeadershipMember, 'id'>) => {
    const newMember: LeadershipMember = {
      ...memberData,
      id: `lead-${Date.now()}`,
    };
    setLeadership((prev) => [...prev, newMember]);
  };

  const updateLeadershipMember = (id: string, fields: Partial<LeadershipMember>) => {
    setLeadership((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...fields } : m))
    );
  };

  const deleteLeadershipMember = (id: string) => {
    setLeadership((prev) => prev.filter((m) => m.id !== id));
  };

  const resetToDefaults = () => {
    localStorage.clear();
    setPosts(INITIAL_POSTS);
    setIssues(INITIAL_ISSUES);
    setSafetyNotices(INITIAL_SAFETY_NOTICES);
    setCommunityWork(INITIAL_COMMUNITY_WORK);
    setSupporters(INITIAL_SUPPORTERS);
    setStats(INITIAL_STATS);
    setSettings(INITIAL_ORG_SETTINGS);
    setGallery(INITIAL_GALLERY);
    setLeadership(INITIAL_LEADERSHIP);
  };

  return (
    <AppContext.Provider
      value={{
        posts,
        issues,
        safetyNotices,
        communityWork,
        supporters,
        gallery,
        stats,
        settings,
        leadership,
        emergencyContacts: EMERGENCY_CONTACTS,
        isEditorOpen,
        setIsEditorOpen,
        editorActiveSection,
        setEditorActiveSection,
        createIssue,
        getIssueByRef,
        updateIssueStatus,
        updateIssue,
        deleteIssue,
        createPost,
        updatePost,
        deletePost,
        likePost,
        addComment,
        createSafetyNotice,
        updateSafetyNotice,
        deleteSafetyNotice,
        createCommunityWork,
        updateCommunityWork,
        deleteCommunityWork,
        createSupporter,
        createGalleryItem,
        deleteGalleryItem,
        updateStats,
        updateSettings,
        createLeadershipMember,
        updateLeadershipMember,
        deleteLeadershipMember,
        resetToDefaults,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
