/**
 * Minimal Supabase Database types for mentorship tables.
 * This avoids running full type generation while keeping TypeScript happy.
 */

export type MentorshipUserRole = 'admin' | 'mentor' | 'mentee';
export type ResourceType = 'video' | 'quiz' | 'project';
export type SubmissionStatus = 'pending' | 'submitted' | 'graded';
export type ProgramStatus = 'active' | 'upcoming' | 'completed';

export interface MentorshipProgram {
  id: string;
  title: string;
  description: string | null;
  tech_tags: string[];
  start_date: string | null;
  end_date: string | null;
  status: ProgramStatus;
  created_at: string;
  updated_at: string;
}

export interface MentorshipUser {
  id: string;
  name: string;
  role: MentorshipUserRole;
  email: string | null;
  enrollment_no: string | null;
  password_hash: string;
  program_ids: string[];
  tags: string[];
  interest_tags?: string[];
  avatar_config?: Record<string, any> | null;
  created_at: string;
  updated_at: string;
}

export interface MentorshipResource {
  id: string;
  program_id: string;
  type: ResourceType;
  title: string;
  description: string | null;
  video_url: string | null;
  questions: Array<{
    id: string;
    text: string;
    options: string[];
    correctAnswer: string | number;
    points?: number;
  }> | null;
  quiz_link: string | null;
  problem_statement: string | null;
  guidelines: string | null;
  deadline: string;
  max_score: number;
  created_by: string | null;
  created_at: string;
  updated_at: string;
}

export interface MentorshipSubmission {
  id: string;
  resource_id: string;
  mentee_id: string;
  status: SubmissionStatus;
  answers: Record<string, string | number> | null;
  link: string | null;
  repo_url?: string | null;
  demo_url?: string | null;
  notes?: string | null;
  score: number | null;
  feedback: string | null;
  submitted_at: string | null;
  created_at: string;
  updated_at: string;
}

