/**
 * Client-side API helper for the Mentorship Portal.
 * Uses process.env.NEXT_PUBLIC_MENTORSHIP_API_URL if configured,
 * otherwise falls back to relative `/api/mentorship` paths.
 * All requests include credentials for cookie-based session management.
 */

import { demoApiAdapter } from './demo-store';

export const IS_DEMO_MODE = process.env.NEXT_PUBLIC_MENTORSHIP_DEMO !== 'false';

const API_BASE = (process.env.NEXT_PUBLIC_MENTORSHIP_API_URL || '').replace(/\/$/, '') + '/api/mentorship';

async function fetcher<T = any>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers || {});
  if (!headers.has('Content-Type') && options.body && typeof options.body === 'string') {
    headers.set('Content-Type', 'application/json');
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
    credentials: 'include',
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || `HTTP ${res.status}`);
  }

  return data;
}

const liveApi = {
  // Auth
  login: (identifier: string, password: string) =>
    fetcher('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ identifier, password }),
    }),

  signup: (data: {
    name: string;
    email: string;
    password: string;
    program_id: string;
    interest_tags?: string[];
  }) =>
    fetcher<{ success: boolean; user: any; enrollment_no: string; token: string }>('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    }),

  logout: () => fetcher('/auth/logout', { method: 'POST' }),

  getMe: () => fetcher<{ user: any | null }>('/auth/me'),

  // Programs
  getPrograms: () => fetcher<{ programs: any[] }>('/programs'),
  createProgram: (data: any) =>
    fetcher<{ program: any }>('/programs', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateProgram: (id: string, data: any) =>
    fetcher<{ program: any }>(`/programs/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteProgram: (id: string) =>
    fetcher<{ success: boolean }>(`/programs/${id}`, {
      method: 'DELETE',
    }),

  // Users
  getUsers: (role?: string) =>
    fetcher<{ users: any[] }>(`/users${role ? `?role=${role}` : ''}`),
  createUser: (data: { name: string; role: 'mentor' | 'mentee'; email?: string; program_ids?: string[]; tags?: string[] }) =>
    fetcher<{ user: any; credentials: { identifier: string; tempPassword: string; note: string } }>('/users', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getUserById: (id: string) => fetcher<{ user: any }>(`/users/${id}`),
  updateUser: (id: string, data: any) =>
    fetcher<{ user: any }>(`/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Resources
  getResources: (programId?: string, type?: string) => {
    const params = new URLSearchParams();
    if (programId) params.set('program_id', programId);
    if (type) params.set('type', type);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetcher<{ resources: any[] }>(`/resources${qs}`);
  },
  createResource: (data: any) =>
    fetcher<{ resource: any }>('/resources', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  updateResource: (id: string, data: any) =>
    fetcher<{ resource: any }>(`/resources/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),
  deleteResource: (id: string) =>
    fetcher<{ success: boolean }>(`/resources/${id}`, {
      method: 'DELETE',
    }),

  // Submissions
  getSubmissions: (resourceId?: string, menteeId?: string) => {
    const params = new URLSearchParams();
    if (resourceId) params.set('resource_id', resourceId);
    if (menteeId) params.set('mentee_id', menteeId);
    const qs = params.toString() ? `?${params.toString()}` : '';
    return fetcher<{ submissions: any[] }>(`/submissions${qs}`);
  },
  createSubmission: (data: {
    resource_id: string;
    answers?: any;
    link?: string;
    repo_url?: string;
    demo_url?: string;
    notes?: string;
  }) =>
    fetcher<{ submission: any }>('/submissions', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  gradeSubmission: (id: string, data: { score?: number; feedback?: string; status?: string }) =>
    fetcher<{ submission: any }>(`/submissions/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    }),

  // Leaderboard
  getLeaderboard: (programId?: string) =>
    fetcher<{ leaderboard: any[]; total: number }>(`/leaderboard${programId ? `?program_id=${programId}` : ''}`),
};

export const mentorshipApi = IS_DEMO_MODE ? demoApiAdapter : liveApi;
