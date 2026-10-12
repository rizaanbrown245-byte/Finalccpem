import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CommunityIssue, IssueStatus } from '../types';

export interface IssueNotification {
  id: string;
  reference_number: string;
  issue_title: string;
  suburb: string;
  old_status?: IssueStatus;
  new_status: IssueStatus;
  note?: string;
  timestamp: string;
  read: boolean;
}

interface NotificationContextType {
  notifications: IssueNotification[];
  unreadCount: number;
  followedRefs: string[];
  activeToast: IssueNotification | null;
  isPanelOpen: boolean;
  setIsPanelOpen: (open: boolean) => void;
  followIssue: (ref: string, currentStatus?: IssueStatus) => void;
  unfollowIssue: (ref: string) => void;
  isFollowing: (ref: string) => boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  dismissToast: () => void;
  browserPermission: NotificationPermission;
  requestBrowserPermission: () => Promise<boolean>;
  triggerTestNotification: () => void;
  checkStatusChanges: (currentIssues: CommunityIssue[]) => void;
}

const STORAGE_KEYS = {
  FOLLOWED: 'pe_followed_issues_v1',
  KNOWN_STATUSES: 'pe_known_issue_statuses_v1',
  NOTIFICATIONS: 'pe_issue_notifications_v1',
};

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

// Web Audio API chime generator for pleasant audible alert
function playChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;

    // Tone 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.15, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.25);

    // Tone 2 (higher note)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.15, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.45);
  } catch {
    // Ignore audio restrictions
  }
}

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const [activeToast, setActiveToast] = useState<IssueNotification | null>(null);
  const [browserPermission, setBrowserPermission] = useState<NotificationPermission>(
    typeof Notification !== 'undefined' ? Notification.permission : 'default'
  );

  // Load followed issues
  const [followedRefs, setFollowedRefs] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FOLLOWED);
      if (saved) return JSON.parse(saved);
      // Default to follow first sample issues if none saved
      return ['CPM-8491', 'CPM-8492'];
    } catch {
      return ['CPM-8491', 'CPM-8492'];
    }
  });

  // Track known statuses to compare when state updates
  const [knownStatuses, setKnownStatuses] = useState<Record<string, IssueStatus>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.KNOWN_STATUSES);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Load notifications history
  const [notifications, setNotifications] = useState<IssueNotification[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
      if (saved) return JSON.parse(saved);

      // Seed initial welcoming notification
      return [
        {
          id: 'welcome-notif-1',
          reference_number: 'CPM-8491',
          issue_title: 'Severe Sewage Overflow & Road Degradation',
          suburb: 'Bethelsdorp Ext 31',
          old_status: 'Reported',
          new_status: 'Dispatched',
          note: 'Municipal Sanitation Jetting truck and Roads Maintenance crew deployed to site.',
          timestamp: new Date(Date.now() - 1000 * 60 * 45).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          }),
          read: false,
        },
      ];
    } catch {
      return [];
    }
  });

  // Persist followed issues
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FOLLOWED, JSON.stringify(followedRefs));
    } catch (e) {
      console.warn('Failed saving followed issues', e);
    }
  }, [followedRefs]);

  // Persist known statuses
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.KNOWN_STATUSES, JSON.stringify(knownStatuses));
    } catch (e) {
      console.warn('Failed saving known statuses', e);
    }
  }, [knownStatuses]);

  // Persist notifications
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
    } catch (e) {
      console.warn('Failed saving notifications', e);
    }
  }, [notifications]);

  // Auto-dismiss toast after 6.5 seconds
  useEffect(() => {
    if (!activeToast) return;
    const timer = setTimeout(() => {
      setActiveToast(null);
    }, 6500);
    return () => clearTimeout(timer);
  }, [activeToast]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const isFollowing = useCallback(
    (ref: string) => {
      if (!ref) return false;
      const clean = ref.trim().toUpperCase();
      return followedRefs.includes(clean);
    },
    [followedRefs]
  );

  const followIssue = useCallback((ref: string, currentStatus?: IssueStatus) => {
    if (!ref) return;
    const clean = ref.trim().toUpperCase();
    setFollowedRefs((prev) => {
      if (prev.includes(clean)) return prev;
      return [clean, ...prev];
    });

    if (currentStatus) {
      setKnownStatuses((prev) => ({
        ...prev,
        [clean]: currentStatus,
      }));
    }
  }, []);

  const unfollowIssue = useCallback((ref: string) => {
    if (!ref) return;
    const clean = ref.trim().toUpperCase();
    setFollowedRefs((prev) => prev.filter((r) => r !== clean));
  }, []);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const dismissToast = useCallback(() => {
    setActiveToast(null);
  }, []);

  const requestBrowserPermission = async (): Promise<boolean> => {
    if (typeof Notification === 'undefined') return false;
    try {
      const permission = await Notification.requestPermission();
      setBrowserPermission(permission);
      return permission === 'granted';
    } catch {
      return false;
    }
  };

  /**
   * Dispatches a new notification to toast, history, audio, and browser native notification
   */
  const emitNotification = useCallback(
    (notif: IssueNotification) => {
      setNotifications((prev) => [notif, ...prev]);
      setActiveToast(notif);
      playChime();

      // Trigger Web Notification API if permitted
      if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
        try {
          new Notification(`Concerned Citizens PE: ${notif.reference_number} Updated`, {
            body: `Status changed to ${notif.new_status} (${notif.suburb}): ${notif.issue_title}`,
            icon: '/logo.jpg',
            tag: notif.reference_number,
          });
        } catch {
          // Ignore notification constructor errors in restricted iframes
        }
      }
    },
    []
  );

  /**
   * Inspects current list of issues and compares against known statuses for followed issues.
   * If a followed issue received an update, fires an alert immediately!
   */
  const checkStatusChanges = useCallback(
    (currentIssues: CommunityIssue[]) => {
      if (!currentIssues || currentIssues.length === 0) return;

      const newKnownStatuses: Record<string, IssueStatus> = { ...knownStatuses };
      let updatedSomething = false;

      currentIssues.forEach((issue) => {
        const ref = issue.reference_number.toUpperCase();
        const prevStatus = knownStatuses[ref];

        // If status was known before, and is followed, and status changed:
        if (prevStatus && prevStatus !== issue.status && followedRefs.includes(ref)) {
          const latestNote =
            issue.timeline?.[0]?.note ||
            issue.admin_notes ||
            `Issue status updated from ${prevStatus} to ${issue.status}.`;

          const newNotif: IssueNotification = {
            id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
            reference_number: ref,
            issue_title: issue.title,
            suburb: issue.suburb,
            old_status: prevStatus,
            new_status: issue.status,
            note: latestNote,
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            read: false,
          };

          emitNotification(newNotif);
        }

        // Keep current status tracked
        if (newKnownStatuses[ref] !== issue.status) {
          newKnownStatuses[ref] = issue.status;
          updatedSomething = true;
        }
      });

      if (updatedSomething) {
        setKnownStatuses(newKnownStatuses);
      }
    },
    [followedRefs, knownStatuses, emitNotification]
  );

  /**
   * Helper for testing the notification system with 1 click
   */
  const triggerTestNotification = useCallback(() => {
    const sampleRef = followedRefs[0] || 'CPM-8492';
    const testNotif: IssueNotification = {
      id: `test-notif-${Date.now()}`,
      reference_number: sampleRef,
      issue_title: 'High-Pressure Water Main Burst on Stanford Rd',
      suburb: 'Gelvandale',
      old_status: 'Under Investigation',
      new_status: 'Dispatched',
      note: 'Municipal Water Distribution depot dispatched emergency valve isolation crew to site.',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      read: false,
    };
    emitNotification(testNotif);
  }, [followedRefs, emitNotification]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        followedRefs,
        activeToast,
        isPanelOpen,
        setIsPanelOpen,
        followIssue,
        unfollowIssue,
        isFollowing,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        dismissToast,
        browserPermission,
        requestBrowserPermission,
        triggerTestNotification,
        checkStatusChanges,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = (): NotificationContextType => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
