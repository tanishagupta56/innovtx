-- Mentorship Portal Schema Migration
-- Run this in your Supabase SQL Editor (or via supabase db push)
-- All tables are prefixed with mentorship_ to stay separate from main site tables.

-- ============================================================
-- mentorship_programs
-- ============================================================
CREATE TABLE IF NOT EXISTS mentorship_programs (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  tech_tags   TEXT[] DEFAULT '{}',
  start_date  TIMESTAMPTZ,
  end_date    TIMESTAMPTZ,
  status      TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('active', 'upcoming', 'completed')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- mentorship_users
-- ============================================================
CREATE TABLE IF NOT EXISTS mentorship_users (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name            TEXT NOT NULL,
  role            TEXT NOT NULL CHECK (role IN ('admin', 'mentor', 'mentee')),
  email           TEXT UNIQUE,
  enrollment_no   TEXT UNIQUE,                -- TN-YYYY-XXXX for mentees
  password_hash   TEXT NOT NULL,
  program_ids     UUID[] DEFAULT '{}',        -- array of mentorship_programs.id
  tags            TEXT[] DEFAULT '{}',        -- skill tags
  created_at      TIMESTAMPTZ DEFAULT NOW(),
  updated_at      TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT email_or_enrollment CHECK (
    (role IN ('admin', 'mentor') AND email IS NOT NULL) OR
    (role = 'mentee' AND enrollment_no IS NOT NULL)
  )
);

-- ============================================================
-- mentorship_resources
-- ============================================================
CREATE TABLE IF NOT EXISTS mentorship_resources (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  program_id        UUID NOT NULL REFERENCES mentorship_programs(id) ON DELETE CASCADE,
  type              TEXT NOT NULL CHECK (type IN ('video', 'quiz', 'project')),
  title             TEXT NOT NULL,
  description       TEXT,
  video_url         TEXT,                     -- for type=video
  questions         JSONB,                    -- for type=quiz: [{id, text, options[], correctAnswer, points}]
  quiz_link         TEXT,                     -- for type=quiz with external link
  problem_statement TEXT,                     -- for type=project
  guidelines        TEXT,                     -- for type=project
  deadline          TIMESTAMPTZ NOT NULL,
  max_score         INTEGER NOT NULL DEFAULT 100,
  created_by        UUID REFERENCES mentorship_users(id),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  updated_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- mentorship_submissions
-- ============================================================
CREATE TABLE IF NOT EXISTS mentorship_submissions (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id  UUID NOT NULL REFERENCES mentorship_resources(id) ON DELETE CASCADE,
  mentee_id    UUID NOT NULL REFERENCES mentorship_users(id) ON DELETE CASCADE,
  status       TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'submitted', 'graded')),
  answers      JSONB,                         -- for quiz answers: {questionId: answer}
  link         TEXT,                          -- for project submission link
  score        INTEGER,
  feedback     TEXT,
  submitted_at TIMESTAMPTZ,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (resource_id, mentee_id)
);

-- ============================================================
-- Indexes for common query patterns
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_mentorship_users_role ON mentorship_users(role);
CREATE INDEX IF NOT EXISTS idx_mentorship_resources_program ON mentorship_resources(program_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_submissions_mentee ON mentorship_submissions(mentee_id);
CREATE INDEX IF NOT EXISTS idx_mentorship_submissions_resource ON mentorship_submissions(resource_id);

-- ============================================================
-- Disable Supabase RLS for mentorship tables
-- (access controlled via custom JWT RBAC in API routes)
-- ============================================================
ALTER TABLE mentorship_programs   DISABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_users      DISABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_resources  DISABLE ROW LEVEL SECURITY;
ALTER TABLE mentorship_submissions DISABLE ROW LEVEL SECURITY;
