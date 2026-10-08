import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
} from 'react';

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

import { supabase, isSupabaseConfigured } from '../lib/supabase';

interface PortalState {
  posts: CommunityPost[];
  issues: CommunityIssue[];
  safetyNotices: CrimeSafetyNotice[];
  communityWork: CommunityWorkItem[];
  supporters: Supporter[];
  gallery: GalleryItem[];
  stats: CommunityStats;
  settings: OrgSettings;
  leadership: LeadershipMember[];
}

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

  isEditorOpen: boolean;
  setIsEditorOpen: (open: boolean) => void;

  editorActiveSection: string;
  setEditorActiveSection: (section: string) => void;

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

  createSafetyNotice: (notice: Omit<CrimeSafetyNotice, 'id'>) => void;
  updateSafetyNotice: (
    id: string,
    fields: Partial<CrimeSafetyNotice>
  ) => void;
  deleteSafetyNotice: (id: string) => void;

  createCommunityWork: (
    work: Omit<CommunityWorkItem, 'id'>
  ) => void;

  updateCommunityWork: (
    id: string,
    fields: Partial<CommunityWorkItem>
  ) => void;

  deleteCommunityWork: (id: string) => void;

  createSupporter: (
    supporter: Omit<Supporter, 'id'>
  ) => void;

  createGalleryItem: (
    item: Omit<GalleryItem, 'id'>
  ) => GalleryItem;

  deleteGalleryItem: (id: string) => void;

  updateStats: (newStats: Partial<CommunityStats>) => void;
  updateSettings: (newSettings: Partial<OrgSettings>) => void;

  leadership: LeadershipMember[];

  createLeadershipMember: (
    member: Omit<LeadershipMember, 'id'>
  ) => void;

  updateLeadershipMember: (
    id: string,
    fields: Partial<LeadershipMember>
  ) => void;

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

const PORTAL_ID = 'main';

const getLocalValue = <T,>(
  key: string,
  fallback: T
): T => {
  try {
    const saved = localStorage.getItem(key);

    if (!saved) {
      return fallback;
    }

    return JSON.parse(saved) as T;
  } catch {
    return fallback;
  }
};

const getLocalPortalState = (): PortalState => {
  let settings = getLocalValue(
    STORAGE_KEYS.SETTINGS,
    INITIAL_ORG_SETTINGS
  );

  if (
    !settings.founder_name ||
    settings.founder_name === 'Rizaan Brown'
  ) {
    settings = {
      ...settings,
      founder_name: 'Farouk Jeftha',
      founder_title: 'Movement Founder & Civil Leader',
      founder_bio: INITIAL_ORG_SETTINGS.founder_bio,
      founder_quote: INITIAL_ORG_SETTINGS.founder_quote,
    };
  }

  let leadership = getLocalValue(
    STORAGE_KEYS.LEADERSHIP,
    INITIAL_LEADERSHIP
  );

  try {
    const founderIdx = leadership.findIndex(
      (l) => l.is_founder || l.category === 'founder'
    );

    if (
      founderIdx !== -1 &&
      leadership[founderIdx].name === 'Rizaan Brown'
    ) {
      leadership[founderIdx] = INITIAL_LEADERSHIP[0];

      if (
        !leadership.some(
          (l) => l.name === 'Rizaan Brown'
        )
      ) {
        leadership.splice(1, 0, INITIAL_LEADERSHIP[1]);
      }
    } else if (
      !leadership.some((l) =>
        l.name.toLowerCase().includes('farouk')
      )
    ) {
      leadership.unshift(INITIAL_LEADERSHIP[0]);
    }

    const seenIds = new Set<string>();
    const seenNames = new Set<string>();

    leadership = leadership.filter((member) => {
      if (!member.id || !member.name) {
        return false;
      }

      if (
        seenIds.has(member.id) ||
        seenNames.has(member.name.toLowerCase().trim())
      ) {
        return false;
      }

      seenIds.add(member.id);
      seenNames.add(member.name.toLowerCase().trim());

      return true;
    });

    leadership = leadership.map((member, index) => {
      if (
        member.name === 'Daryl Kock' &&
        member.id === 'lead-03'
      ) {
        return {
          ...member,
          id: 'lead-03-cpf',
        };
      }

      return {
        ...member,
        id: member.id || `lead-${index + 1}`,
      };
    });
  } catch {
    leadership = INITIAL_LEADERSHIP;
  }

  return {
    posts: getLocalValue(
      STORAGE_KEYS.POSTS,
      INITIAL_POSTS
    ),

    issues: getLocalValue(
      STORAGE_KEYS.ISSUES,
      INITIAL_ISSUES
    ),

    safetyNotices: getLocalValue(
      STORAGE_KEYS.NOTICES,
      INITIAL_SAFETY_NOTICES
    ),

    communityWork: getLocalValue(
      STORAGE_KEYS.WORK,
      INITIAL_COMMUNITY_WORK
    ),

    supporters: getLocalValue(
      STORAGE_KEYS.SUPPORTERS,
      INITIAL_SUPPORTERS
    ),

    gallery: getLocalValue(
      STORAGE_KEYS.GALLERY,
      INITIAL_GALLERY
    ),

    stats: getLocalValue(
      STORAGE_KEYS.STATS,
      INITIAL_STATS
    ),

    settings,

    leadership,
  };
};

const hasPortalData = (
  data: Partial<PortalState> | null | undefined
) => {
  if (!data) {
    return false;
  }

  return Object.keys(data).length > 0;
};

export const AppProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  const [editorActiveSection, setEditorActiveSection] =
    useState('branding');

  /*
   * IMPORTANT:
   * We initially use local data so the website does not appear empty
   * while Supabase is loading.
   *
   * Supabase then becomes the authoritative source.
   */
  const localPortalStateRef = useRef<PortalState>(
    getLocalPortalState()
  );

  const localPortalState = localPortalStateRef.current;

  const [posts, setPosts] = useState<CommunityPost[]>(
    localPortalState.posts
  );

  const [issues, setIssues] = useState<CommunityIssue[]>(
    localPortalState.issues
  );

  const [safetyNotices, setSafetyNotices] =
    useState<CrimeSafetyNotice[]>(
      localPortalState.safetyNotices
    );

  const [communityWork, setCommunityWork] =
    useState<CommunityWorkItem[]>(
      localPortalState.communityWork
    );

  const [supporters, setSupporters] =
    useState<Supporter[]>(
      localPortalState.supporters
    );

  const [gallery, setGallery] =
    useState<GalleryItem[]>(
      localPortalState.gallery
    );

  const [stats, setStats] =
    useState<CommunityStats>(
      localPortalState.stats
    );

  const [settings, setSettings] =
    useState<OrgSettings>(
      localPortalState.settings
    );

  const [leadership, setLeadership] =
    useState<LeadershipMember[]>(
      localPortalState.leadership
    );

  /*
   * Prevents the initial localStorage state from immediately
   * overwriting Supabase before the Supabase load has completed.
   */
  const supabaseLoadedRef = useRef(false);

  const saveToSupabase = async (
    state: PortalState
  ) => {
    if (!isSupabaseConfigured) {
      console.warn(
        'Supabase is not configured. Data was not uploaded.'
      );
      return;
    }

    try {
      const { error } = await supabase
        .from('portal_state')
        .upsert(
          {
            id: PORTAL_ID,
            data: state,
            updated_at: new Date().toISOString(),
          },
          {
            onConflict: 'id',
          }
        );

      if (error) {
        console.error(
          'Supabase save failed:',
          error
        );
      } else {
        console.log(
          'Portal data saved to Supabase.'
        );
      }
    } catch (error) {
      console.error(
        'Unexpected Supabase save error:',
        error
      );
    }
  };

  /*
   * Load the central portal state from Supabase.
   *
   * If the Supabase row is still empty, migrate the existing
   * Device A/localStorage data into Supabase.
   */
  useEffect(() => {
    let cancelled = false;

    const loadPortalState = async () => {
      if (!isSupabaseConfigured) {
        console.warn(
          'Supabase is not configured. Using local data only.'
        );

        supabaseLoadedRef.current = true;
        return;
      }

      try {
        const { data, error } = await supabase
          .from('portal_state')
          .select('data, updated_at')
          .eq('id', PORTAL_ID)
          .maybeSingle();

        if (error) {
          console.error(
            'Supabase load failed:',
            error
          );

          supabaseLoadedRef.current = true;
          return;
        }

        if (cancelled) {
          return;
        }

        const remoteData =
          (data?.data || {}) as Partial<PortalState>;

        /*
         * If Supabase already contains real data,
         * Supabase wins.
         */
        if (hasPortalData(remoteData)) {
          if (remoteData.posts) {
            setPosts(remoteData.posts);
          }

          if (remoteData.issues) {
            setIssues(remoteData.issues);
          }

          if (remoteData.safetyNotices) {
            setSafetyNotices(
              remoteData.safetyNotices
            );
          }

          if (remoteData.communityWork) {
            setCommunityWork(
              remoteData.communityWork
            );
          }

          if (remoteData.supporters) {
            setSupporters(
              remoteData.supporters
            );
          }

          if (remoteData.gallery) {
            setGallery(remoteData.gallery);
          }

          if (remoteData.stats) {
            setStats(remoteData.stats);
          }

          if (remoteData.settings) {
            setSettings(remoteData.settings);
          }

          if (remoteData.leadership) {
            setLeadership(
              remoteData.leadership
            );
          }

          console.log(
            'Portal data loaded from Supabase.'
          );
        } else {
          /*
           * First-time migration:
           * upload the existing Device A data.
           */
          const initialState: PortalState = {
            posts: localPortalState.posts,
            issues: localPortalState.issues,
            safetyNotices:
              localPortalState.safetyNotices,
            communityWork:
              localPortalState.communityWork,
            supporters:
              localPortalState.supporters,
            gallery:
              localPortalState.gallery,
            stats:
              localPortalState.stats,
            settings:
              localPortalState.settings,
            leadership:
              localPortalState.leadership,
          };

          await saveToSupabase(initialState);

          console.log(
            'Existing local data migrated to Supabase.'
          );
        }
      } catch (error) {
        console.error(
          'Unable to load portal data:',
          error
        );
      } finally {
        if (!cancelled) {
          supabaseLoadedRef.current = true;
        }
      }
    };

    loadPortalState();

    return () => {
      cancelled = true;
    };
  }, []);

  /*
   * SINGLE SOURCE OF TRUTH:
   *
   * After Supabase has loaded, every state change is written
   * back to Supabase.
   */
  useEffect(() => {
    if (!supabaseLoadedRef.current) {
      return;
    }

    const state: PortalState = {
      posts,
      issues,
      safetyNotices,
      communityWork,
      supporters,
      gallery,
      stats,
      settings,
      leadership,
    };

    void saveToSupabase(state);
  }, [
    posts,
    issues,
    safetyNotices,
    communityWork,
    supporters,
    gallery,
    stats,
    settings,
    leadership,
  ]);

  /*
   * Keep localStorage as a local cache only.
   *
   * It is NOT the source of truth anymore.
   */
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEYS.POSTS,
        JSON.stringify(posts)
      );
      localStorage.setItem(
        STORAGE_KEYS.ISSUES,
        JSON.stringify(issues)
      );
      localStorage.setItem(
        STORAGE_KEYS.NOTICES,
        JSON.stringify(safetyNotices)
      );
      localStorage.setItem(
        STORAGE_KEYS.WORK,
        JSON.stringify(communityWork)
      );
      localStorage.setItem(
        STORAGE_KEYS.SUPPORTERS,
        JSON.stringify(supporters)
      );
      localStorage.setItem(
        STORAGE_KEYS.GALLERY,
        JSON.stringify(gallery)
      );
      localStorage.setItem(
        STORAGE_KEYS.STATS,
        JSON.stringify(stats)
      );
      localStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings)
      );
      localStorage.setItem(
        STORAGE_KEYS.LEADERSHIP,
        JSON.stringify(leadership)
      );
    } catch (error) {
      console.warn(
        'Unable to update local cache:',
        error
      );
    }
  }, [
    posts,
    issues,
    safetyNotices,
    communityWork,
    supporters,
    gallery,
    stats,
    settings,
    leadership,
  ]);

  // =========================
  // ISSUE MANAGEMENT
  // =========================

  const createIssue = (
    issueData: Omit<
      CommunityIssue,
      'id' | 'reference_number' | 'created_at' | 'updated_at' | 'timeline'
    >
  ): CommunityIssue => {
    const randomSuffix = Math.floor(
      1000 + Math.random() * 9000
    );

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
          timestamp: new Date().toLocaleDateString(
            'en-ZA',
            {
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit',
            }
          ),
          note:
            'Issue officially logged via Citizen of PE Metro portal. Tracking reference generated.',
        },
      ],
    };

    setIssues((prev) => [
      newIssue,
      ...prev,
    ]);

    return newIssue;
  };

  const getIssueByRef = (
    ref: string
  ): CommunityIssue | undefined => {
    if (!ref) {
      return undefined;
    }

    const clean = ref.trim().toUpperCase();

    return issues.find(
      (i) =>
        i.reference_number.toUpperCase() ===
          clean ||
        i.reference_number.toUpperCase() ===
          `CPM-${clean}`
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
        if (issue.id !== id) {
          return issue;
        }

        const newTimeline = [
          ...issue.timeline,
        ];

        newTimeline.unshift({
          status,
          timestamp:
            new Date().toLocaleDateString(
              'en-ZA',
              {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              }
            ),
          note:
            note ||
            `Status updated to ${status}.`,
        });

        return {
          ...issue,
          status,
          assigned_team:
            assignedTeam ||
            issue.assigned_team,
          updated_at:
            new Date().toISOString(),
          timeline: newTimeline,
        };
      })
    );
  };

  const updateIssue = (
    id: string,
    fields: Partial<CommunityIssue>
  ) => {
    setIssues((prev) =>
      prev.map((i) =>
        i.id === id
          ? {
              ...i,
              ...fields,
              updated_at:
                new Date().toISOString(),
            }
          : i
      )
    );
  };

  const deleteIssue = (id: string) => {
    setIssues((prev) =>
      prev.filter(
        (issue) => issue.id !== id
      )
    );
  };

  // =========================
  // COMMUNITY POSTS
  // =========================

  const createPost = (
    postData: Omit<
      CommunityPost,
      'id' | 'likes' | 'comments_count' | 'created_at'
    > & {
      likes?: number;
      created_at?: string;
      comments_count?: number;
    }
  ): CommunityPost => {
    const newPost: CommunityPost = {
      ...postData,
      id: `post-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 6)}`,
      likes: postData.likes ?? 0,
      comments_count:
        postData.comments_count ?? 0,
      created_at:
        postData.created_at ||
        new Date().toISOString(),
      comments: [],
    };

    setPosts((prev) => [
      newPost,
      ...prev,
    ]);

    return newPost;
  };

  const updatePost = (
    id: string,
    fields: Partial<CommunityPost>
  ) => {
    setPosts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              ...fields,
            }
          : p
      )
    );
  };

  const deletePost = (id: string) => {
    setPosts((prev) =>
      prev.filter(
        (p) => p.id !== id
      )
    );
  };

  const likePost = (id: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === id) {
          return {
            ...post,
            likes: post.likes + 1,
          };
        }

        return post;
      })
    );
  };

  const addComment = (
    postId: string,
    author: string,
    text: string
  ) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id !== postId) {
          return post;
        }

        const newComment = {
          id: `comment-${Date.now()}`,
          author,
          text,
          created_at: 'Just now',
        };

        const existing =
          post.comments || [];

        return {
          ...post,
          comments_count:
            post.comments_count + 1,
          comments: [
            ...existing,
            newComment,
          ],
        };
      })
    );
  };

  // =========================
  // SAFETY NOTICES
  // =========================

  const createSafetyNotice = (
    noticeData: Omit<
      CrimeSafetyNotice,
      'id'
    >
  ) => {
    const newNotice: CrimeSafetyNotice = {
      ...noticeData,
      id: `cs-${Date.now()}`,
    };

    setSafetyNotices((prev) => [
      newNotice,
      ...prev,
    ]);
  };

  const updateSafetyNotice = (
    id: string,
    fields: Partial<CrimeSafetyNotice>
  ) => {
    setSafetyNotices((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              ...fields,
            }
          : n
      )
    );
  };

  const deleteSafetyNotice = (
    id: string
  ) => {
    setSafetyNotices((prev) =>
      prev.filter(
        (n) => n.id !== id
      )
    );
  };

  // =========================
  // COMMUNITY WORK
  // =========================

  const createCommunityWork = (
    workData: Omit<
      CommunityWorkItem,
      'id'
    >
  ) => {
    const newWork: CommunityWorkItem = {
      ...workData,
      id: `cw-${Date.now()}`,
    };

    setCommunityWork((prev) => [
      newWork,
      ...prev,
    ]);
  };

  const updateCommunityWork = (
    id: string,
    fields: Partial<CommunityWorkItem>
  ) => {
    setCommunityWork((prev) =>
      prev.map((w) =>
        w.id === id
          ? {
              ...w,
              ...fields,
            }
          : w
      )
    );
  };

  const deleteCommunityWork = (
    id: string
  ) => {
    setCommunityWork((prev) =>
      prev.filter(
        (w) => w.id !== id
      )
    );
  };

  // =========================
  // SUPPORTERS
  // =========================

  const createSupporter = (
    supporterData: Omit<
      Supporter,
      'id'
    >
  ) => {
    const newSup: Supporter = {
      ...supporterData,
      id: `sup-${Date.now()}`,
    };

    setSupporters((prev) => [
      ...prev,
      newSup,
    ]);
  };

  // =========================
  // GALLERY
  // =========================

  const createGalleryItem = (
    itemData: Omit<
      GalleryItem,
      'id'
    >
  ): GalleryItem => {
    const newItem: GalleryItem = {
      ...itemData,
      id: `gal-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 6)}`,
    };

    setGallery((prev) => [
      newItem,
      ...prev,
    ]);

    return newItem;
  };

  const deleteGalleryItem = (
    id: string
  ) => {
    setGallery((prev) =>
      prev.filter(
        (g) => g.id !== id
      )
    );
  };

  // =========================
  // STATS
  // =========================

  const updateStats = (
    newStats: Partial<CommunityStats>
  ) => {
    setStats((prev) => ({
      ...prev,
      ...newStats,
    }));
  };

  // =========================
  // SETTINGS
  // =========================

  const updateSettings = (
    newSettings: Partial<OrgSettings>
  ) => {
    setSettings((prev) => ({
      ...prev,
      ...newSettings,
    }));
  };

  // =========================
  // LEADERSHIP
  // =========================

  const createLeadershipMember = (
    memberData: Omit<
      LeadershipMember,
      'id'
    >
  ) => {
    const newMember: LeadershipMember = {
      ...memberData,
      id: `lead-${Date.now()}`,
    };

    setLeadership((prev) => [
      ...prev,
      newMember,
    ]);
  };

  const updateLeadershipMember = (
    id: string,
    fields: Partial<LeadershipMember>
  ) => {
    setLeadership((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              ...fields,
            }
          : m
      )
    );
  };

  const deleteLeadershipMember = (
    id: string
  ) => {
    setLeadership((prev) =>
      prev.filter(
        (m) => m.id !== id
      )
    );
  };

  // =========================
  // RESET
  // =========================

  const resetToDefaults = () => {
    const defaults: PortalState = {
      posts: INITIAL_POSTS,
      issues: INITIAL_ISSUES,
      safetyNotices:
        INITIAL_SAFETY_NOTICES,
      communityWork:
        INITIAL_COMMUNITY_WORK,
      supporters:
        INITIAL_SUPPORTERS,
      gallery:
        INITIAL_GALLERY,
      stats:
        INITIAL_STATS,
      settings:
        INITIAL_ORG_SETTINGS,
      leadership:
        INITIAL_LEADERSHIP,
    };

    setPosts(defaults.posts);
    setIssues(defaults.issues);
    setSafetyNotices(
      defaults.safetyNotices
    );
    setCommunityWork(
      defaults.communityWork
    );
    setSupporters(
      defaults.supporters
    );
    setGallery(defaults.gallery);
    setStats(defaults.stats);
    setSettings(defaults.settings);
    setLeadership(
      defaults.leadership
    );

    if (supabaseLoadedRef.current) {
      void saveToSupabase(defaults);
    }
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

        emergencyContacts:
          EMERGENCY_CONTACTS,

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
    throw new Error(
      'useApp must be used within an AppProvider'
    );
  }

  return context;
};
