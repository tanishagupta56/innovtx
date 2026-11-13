/**
 * LocalStorage-based Demo Store for zero-backend standalone testing.
 * Automatically seeded from demo-data.ts; tracks all user edits, submissions,
 * new resources, and grades in the browser's localStorage.
 */

import { getInitialDemoData } from './demo-data';

const STORE_KEY = 'innovtx_mentorship_demo_store_v1';
const SESSION_KEY = 'innovtx_mentorship_demo_session_v1';

export interface DemoStoreData {
  programs: any[];
  users: any[];
  resources: any[];
  submissions: any[];
}

export function getDemoStore(): DemoStoreData {
  if (typeof window === 'undefined') {
    return getInitialDemoData();
  }

  try {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) {
      const initial = getInitialDemoData();
      localStorage.setItem(STORE_KEY, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    if (!parsed.programs || !parsed.users || !parsed.resources || !parsed.submissions) {
      const initial = getInitialDemoData();
      localStorage.setItem(STORE_KEY, JSON.stringify(initial));
      return initial;
    }
    return parsed;
  } catch {
    return getInitialDemoData();
  }
}

export function saveDemoStore(store: DemoStoreData): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(store));
  } catch (err) {
    console.error('[DemoStore] Failed to write to localStorage:', err);
  }
}

export function resetDemoStore(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORE_KEY);
    localStorage.removeItem(SESSION_KEY);
    // Initialize fresh seed
    const fresh = getInitialDemoData();
    localStorage.setItem(STORE_KEY, JSON.stringify(fresh));
  } catch (err) {
    console.error('[DemoStore] Failed to reset demo store:', err);
  }
}

// Session management
export function getDemoSession(): any | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function setDemoSession(user: any): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
  } catch {}
}

export function clearDemoSession(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {}
}

// Unique enrollment number generator in demo mode
export function generateDemoEnrollmentNo(existingUsers: any[]): string {
  const year = new Date().getFullYear();
  let maxSeq = 100;
  for (const u of existingUsers) {
    if (u.enrollment_no && u.enrollment_no.startsWith(`TN-${year}-`)) {
      const seqStr = u.enrollment_no.replace(`TN-${year}-`, '');
      const num = parseInt(seqStr, 10);
      if (!isNaN(num) && num > maxSeq) {
        maxSeq = num;
      }
    }
  }
  return `TN-${year}-${(maxSeq + 1).toString().padStart(4, '0')}`;
}

// ============================================================
// Demo API Adapter (implements identical interface as client-api)
// ============================================================

export const demoApiAdapter = {
  // Auth
  login: async (identifier: string, password: string) => {
    const store = getDemoStore();
    const cleanId = identifier.trim().toLowerCase();
    const isEnrollment = /^TN-\d{4}-\w+$/i.test(cleanId);

    const user = store.users.find((u) => {
      const matchEmail = u.email && u.email.toLowerCase() === cleanId;
      const matchEnrollment = u.enrollment_no && u.enrollment_no.toLowerCase() === cleanId;
      return isEnrollment ? matchEnrollment || matchEmail : matchEmail || matchEnrollment;
    });

    if (!user) {
      throw new Error('User not found with provided credentials.');
    }

    // Demo mode: plain password check
    const userPass = user.password || user.password_hash;
    if (userPass !== password.trim()) {
      throw new Error('Invalid password. Check demo credentials.');
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      role: user.role,
      email: user.email,
      enrollment_no: user.enrollment_no,
      program_ids: user.program_ids || [],
      tags: user.tags || [],
      interest_tags: user.interest_tags || user.tags || [],
      avatar_config: user.avatar_config || { preset: 'Cyber Architect', accent: '#315EFF', seed: user.name.toLowerCase() },
    };

    setDemoSession(sessionUser);
    return { success: true, user: sessionUser, token: 'demo-jwt-token' };
  },

  signup: async (data: {
    name: string;
    email: string;
    password: string;
    program_id: string;
    interest_tags?: string[];
  }) => {
    const store = getDemoStore();
    const cleanEmail = data.email.trim().toLowerCase();

    // Check duplicate email
    const existing = store.users.find((u) => u.email && u.email.toLowerCase() === cleanEmail);
    if (existing) {
      throw new Error('An account with this email already exists in demo mode.');
    }

    const enrollmentNo = generateDemoEnrollmentNo(store.users);
    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name.trim(),
      role: 'mentee',
      email: cleanEmail,
      enrollment_no: enrollmentNo,
      password: data.password,
      password_hash: data.password,
      program_ids: [data.program_id],
      tags: data.interest_tags || [],
      interest_tags: data.interest_tags || [],
      avatar_config: {
        preset: 'Cyber Architect',
        accent: '#315EFF',
        seed: data.name.trim().toLowerCase().replace(/\s+/g, '-'),
      },
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    store.users.push(newUser);
    saveDemoStore(store);

    setDemoSession(newUser);
    return { success: true, user: newUser, enrollment_no: enrollmentNo, token: 'demo-jwt-token' };
  },

  logout: async () => {
    clearDemoSession();
    return { success: true };
  },

  getMe: async () => {
    const session = getDemoSession();
    if (!session) return { user: null };
    const store = getDemoStore();
    const liveUser = store.users.find((u) => u.id === session.id);
    return { user: liveUser || session };
  },

  // Programs
  getPrograms: async () => {
    const store = getDemoStore();
    return { programs: store.programs };
  },

  createProgram: async (data: any) => {
    const store = getDemoStore();
    const newProg = {
      id: `prog-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    store.programs.unshift(newProg);
    saveDemoStore(store);
    return { program: newProg };
  },

  updateProgram: async (id: string, data: any) => {
    const store = getDemoStore();
    const idx = store.programs.findIndex((p) => p.id === id);
    if (idx !== -1) {
      store.programs[idx] = { ...store.programs[idx], ...data, updated_at: new Date().toISOString() };
      saveDemoStore(store);
      return { program: store.programs[idx] };
    }
    throw new Error('Program not found');
  },

  deleteProgram: async (id: string) => {
    const store = getDemoStore();
    store.programs = store.programs.filter((p) => p.id !== id);
    saveDemoStore(store);
    return { success: true };
  },

  // Users
  getUsers: async (role?: string) => {
    const store = getDemoStore();
    const filtered = role ? store.users.filter((u) => u.role === role) : store.users;
    return { users: filtered };
  },

  createUser: async (data: {
    name: string;
    role: 'mentor' | 'mentee';
    email?: string;
    program_ids?: string[];
    tags?: string[];
  }) => {
    const store = getDemoStore();
    const isMentee = data.role === 'mentee';
    const enrollmentNo = isMentee ? generateDemoEnrollmentNo(store.users) : null;
    const tempPassword = `Demo${Math.floor(1000 + Math.random() * 9000)}!`;

    const newUser = {
      id: `user-${Date.now()}`,
      name: data.name,
      role: data.role,
      email: data.email || null,
      enrollment_no: enrollmentNo,
      password: tempPassword,
      password_hash: tempPassword,
      program_ids: data.program_ids || [],
      tags: data.tags || [],
      interest_tags: data.tags || [],
      avatar_config: { preset: 'Cyber Architect', accent: '#315EFF', seed: data.name.toLowerCase() },
      created_at: new Date().toISOString(),
    };

    store.users.push(newUser);
    saveDemoStore(store);

    return {
      user: newUser,
      credentials: {
        identifier: isMentee ? enrollmentNo! : data.email!,
        tempPassword,
        note: 'Share these credentials once — saved in demo storage.',
      },
    };
  },

  getUserById: async (id: string) => {
    const store = getDemoStore();
    const user = store.users.find((u) => u.id === id);
    if (!user) throw new Error('User not found');
    return { user };
  },

  updateUser: async (id: string, data: any) => {
    const store = getDemoStore();
    const idx = store.users.findIndex((u) => u.id === id);
    if (idx !== -1) {
      store.users[idx] = { ...store.users[idx], ...data, updated_at: new Date().toISOString() };
      saveDemoStore(store);

      // If updating current session user, update session too
      const currentSession = getDemoSession();
      if (currentSession && currentSession.id === id) {
        setDemoSession({ ...currentSession, ...store.users[idx] });
      }

      return { user: store.users[idx] };
    }
    throw new Error('User not found');
  },

  // Resources
  getResources: async (programId?: string, type?: string) => {
    const store = getDemoStore();
    let list = store.resources;
    if (programId) list = list.filter((r) => r.program_id === programId);
    if (type) list = list.filter((r) => r.type === type);
    return { resources: list };
  },

  createResource: async (data: any) => {
    const store = getDemoStore();
    const session = getDemoSession();
    const newRes = {
      id: `res-${Date.now()}`,
      created_by: session?.id || 'demo-mentor',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      ...data,
    };
    store.resources.unshift(newRes);
    saveDemoStore(store);
    return { resource: newRes };
  },

  updateResource: async (id: string, data: any) => {
    const store = getDemoStore();
    const idx = store.resources.findIndex((r) => r.id === id);
    if (idx !== -1) {
      store.resources[idx] = { ...store.resources[idx], ...data, updated_at: new Date().toISOString() };
      saveDemoStore(store);
      return { resource: store.resources[idx] };
    }
    throw new Error('Resource not found');
  },

  deleteResource: async (id: string) => {
    const store = getDemoStore();
    store.resources = store.resources.filter((r) => r.id !== id);
    saveDemoStore(store);
    return { success: true };
  },

  // Submissions
  getSubmissions: async (resourceId?: string, menteeId?: string) => {
    const store = getDemoStore();
    let list = store.submissions;
    if (resourceId) list = list.filter((s) => s.resource_id === resourceId);
    if (menteeId) list = list.filter((s) => s.mentee_id === menteeId);
    return { submissions: list };
  },

  createSubmission: async (data: {
    resource_id: string;
    answers?: any;
    link?: string;
    repo_url?: string;
    demo_url?: string;
    notes?: string;
  }) => {
    const store = getDemoStore();
    const session = getDemoSession();
    if (!session) throw new Error('Not authenticated');

    const resource = store.resources.find((r) => r.id === data.resource_id);
    if (!resource) throw new Error('Resource not found');

    // Deadline validation
    if (resource.deadline && new Date().getTime() > new Date(resource.deadline).getTime()) {
      throw new Error('Deadline passed — submission no longer accepted');
    }

    // Auto-scoring logic
    let score: number | null = null;
    let status = 'submitted';

    if (resource.type === 'video') {
      score = resource.max_score ?? 25;
      status = 'graded';
    } else if (resource.type === 'quiz' && resource.questions && data.answers) {
      let earned = 0;
      for (const q of resource.questions) {
        if (data.answers[q.id] !== undefined && String(data.answers[q.id]) === String(q.correctAnswer)) {
          earned += q.points ?? 1;
        }
      }
      const totalPoints = resource.questions.reduce((acc: number, q: any) => acc + (q.points ?? 1), 0);
      score = totalPoints > 0 ? Math.round((earned / totalPoints) * (resource.max_score ?? 50)) : 0;
      status = 'graded';
    }

    // Check if already submitted
    const existingIdx = store.submissions.findIndex(
      (s) => s.resource_id === data.resource_id && s.mentee_id === session.id
    );

    const submissionRecord = {
      id: existingIdx !== -1 ? store.submissions[existingIdx].id : `sub-${Date.now()}`,
      resource_id: data.resource_id,
      mentee_id: session.id,
      status,
      answers: data.answers || null,
      link: data.link || data.demo_url || data.repo_url || null,
      repo_url: data.repo_url || null,
      demo_url: data.demo_url || null,
      notes: data.notes || null,
      score,
      feedback: existingIdx !== -1 ? store.submissions[existingIdx].feedback : null,
      submitted_at: new Date().toISOString(),
      created_at: existingIdx !== -1 ? store.submissions[existingIdx].created_at : new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    if (existingIdx !== -1) {
      store.submissions[existingIdx] = submissionRecord;
    } else {
      store.submissions.push(submissionRecord);
    }

    saveDemoStore(store);
    return { submission: submissionRecord };
  },

  gradeSubmission: async (id: string, data: { score?: number; feedback?: string; status?: string }) => {
    const store = getDemoStore();
    const idx = store.submissions.findIndex((s) => s.id === id);
    if (idx === -1) throw new Error('Submission not found');

    store.submissions[idx] = {
      ...store.submissions[idx],
      ...data,
      status: data.score !== undefined ? 'graded' : data.status || store.submissions[idx].status,
      updated_at: new Date().toISOString(),
    };

    saveDemoStore(store);
    return { submission: store.submissions[idx] };
  },

  // Leaderboard
  getLeaderboard: async (programId?: string) => {
    const store = getDemoStore();
    let targetMentees = store.users.filter((u) => u.role === 'mentee');
    if (programId) {
      targetMentees = targetMentees.filter((u) => (u.program_ids || []).includes(programId));
    }

    const targetResources = programId
      ? store.resources.filter((r) => r.program_id === programId)
      : store.resources;
    const totalResourcesCount = targetResources.length;

    const rows = targetMentees.map((mentee) => {
      const userSubs = store.submissions.filter((s) => s.mentee_id === mentee.id);
      const totalScore = userSubs.reduce((acc, s) => acc + (s.score || 0), 0);
      const completedCount = userSubs.filter((s) => s.status === 'graded' || s.status === 'submitted').length;
      const completionPct = totalResourcesCount > 0 ? Math.round((completedCount / totalResourcesCount) * 100) : 0;

      return {
        id: mentee.id,
        name: mentee.name,
        enrollment_no: mentee.enrollment_no,
        tags: mentee.tags || [],
        interest_tags: mentee.interest_tags || [],
        avatar_config: mentee.avatar_config || null,
        total_score: totalScore,
        completed_count: completedCount,
        total_resources: totalResourcesCount,
        completion_pct: completionPct,
      };
    });

    // Sort by total score descending, then by name
    rows.sort((a, b) => b.total_score - a.total_score || a.name.localeCompare(b.name));

    const ranked = rows.map((r, i) => ({
      ...r,
      rank: i + 1,
    }));

    return { leaderboard: ranked, total: ranked.length };
  },
};
