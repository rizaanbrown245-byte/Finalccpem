// ==============================================================================
// Citizen of PE Metro - Client API Client
// Endpoints for Community Issues, Safety Bulletins, and Relief Operations
// ==============================================================================

import {
  CommunityIssue,
  CommunityPost,
  CommunityStats,
  CommunityWorkItem,
  CrimeSafetyNotice,
  OrgSettings,
} from './types';

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(options?.headers || {}),
    },
  });

  if (!res.ok) {
    let errorMsg = `HTTP Error ${res.status}`;
    try {
      const errorJson = await res.json();
      errorMsg = errorJson.error || errorJson.message || errorMsg;
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  return res.json();
}

export const api = {
  // System / portal status
  async getStatus(): Promise<{
    portal_status: string;
    organization: string;
    metro_area: string;
    timestamp: string;
  }> {
    return request('/api/status');
  },

  // Issues
  async getIssues(): Promise<CommunityIssue[]> {
    return request('/api/issues');
  },

  async createIssue(data: Partial<CommunityIssue>): Promise<CommunityIssue> {
    return request('/api/issues', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Safety notices
  async getSafetyNotices(): Promise<CrimeSafetyNotice[]> {
    return request('/api/safety-notices');
  },

  // Community work & projects
  async getCommunityWork(): Promise<CommunityWorkItem[]> {
    return request('/api/community-work');
  },

  // Community updates / posts
  async getPosts(): Promise<CommunityPost[]> {
    return request('/api/posts');
  },

  async createPost(data: Partial<CommunityPost>): Promise<CommunityPost> {
    return request('/api/posts', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Statistics
  async getStats(): Promise<CommunityStats> {
    return request('/api/stats');
  },

  // Organization settings
  async getSettings(): Promise<OrgSettings> {
    return request('/api/settings');
  },

  // Facebook Integration
  async fetchFacebookPage(pageId: string, accessToken?: string): Promise<any> {
    return request('/api/facebook/fetch-page', {
      method: 'POST',
      body: JSON.stringify({ pageId, accessToken }),
    });
  },
};
