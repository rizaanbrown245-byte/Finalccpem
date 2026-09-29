import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { DEMO_USERS } from '../data/initialData';

interface AuthContextType {
  currentUser: User | null;
  members: User[];
  isAdmin: boolean;
  isLoggedIn: boolean;
  login: (email: string, password?: string) => boolean;
  logout: () => void;
  createMember: (memberData: Omit<User, 'id' | 'joined_at'>) => User;
  updateMember: (id: string, updates: Partial<User>) => void;
  deleteMember: (id: string) => void;
  getMembers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'citizen_pe_auth_user_v1';
const MEMBERS_STORAGE_KEY = 'citizen_pe_members_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [members, setMembers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(MEMBERS_STORAGE_KEY);
      if (saved) {
        const parsed: User[] = JSON.parse(saved);
        // Ensure Farouk Jeftha and Rizaan Brown exist in members
        const hasFarouk = parsed.some((u) => u.email.toLowerCase().includes('farouk'));
        if (!hasFarouk) {
          parsed.unshift(DEMO_USERS[0]); // Farouk Jeftha
        }
        return parsed;
      }
      return DEMO_USERS;
    } catch {
      return DEMO_USERS;
    }
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify(members));
    } catch (e) {
      console.warn('Failed to save members', e);
    }
  }, [members]);

  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save auth state', e);
    }
  }, [currentUser]);

  const login = (email: string, _password?: string): boolean => {
    const cleanEmail = email.trim().toLowerCase();
    const existing = members.find((m) => m.email.toLowerCase() === cleanEmail);

    if (existing) {
      setCurrentUser(existing);
      return true;
    }

    // If logging in with director/admin email or custom
    const isDirector = cleanEmail.includes('admin') || cleanEmail.includes('director') || cleanEmail.includes('rizaan');
    const newUser: User = {
      id: `u-${Date.now()}`,
      name: email.split('@')[0].replace(/[._-]/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()),
      email: cleanEmail,
      role: isDirector ? 'admin' : 'member',
      area: 'Nelson Mandela Bay',
      joined_at: new Date().toISOString().split('T')[0],
    };

    setMembers((prev) => [...prev, newUser]);
    setCurrentUser(newUser);
    return true;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const createMember = (memberData: Omit<User, 'id' | 'joined_at'>): User => {
    const newMember: User = {
      ...memberData,
      id: `u-${Date.now()}`,
      joined_at: new Date().toISOString().split('T')[0],
    };
    setMembers((prev) => [...prev, newMember]);
    return newMember;
  };

  const updateMember = (id: string, updates: Partial<User>) => {
    setMembers((prev) =>
      prev.map((m) => {
        if (m.id === id) {
          const updated = { ...m, ...updates };
          if (currentUser?.id === id) {
            setCurrentUser(updated);
          }
          return updated;
        }
        return m;
      })
    );
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    if (currentUser?.id === id) {
      setCurrentUser(null);
    }
  };

  const getMembers = (): User[] => {
    return members;
  };

  const isAdmin = currentUser?.role === 'admin';
  const isLoggedIn = currentUser !== null;

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        members,
        isAdmin,
        isLoggedIn,
        login,
        logout,
        createMember,
        updateMember,
        deleteMember,
        getMembers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
