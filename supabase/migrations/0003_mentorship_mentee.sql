-- Migration 0003: Mentee self-signup, profile customization, and project submissions
-- Only alters/adds to mentorship_ tables

-- Add interest_tags and avatar_config to mentorship_users
ALTER TABLE mentorship_users
  ADD COLUMN IF NOT EXISTS interest_tags TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS avatar_config JSONB DEFAULT '{}'::jsonb;

-- Ensure email is unique if not already enforced
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'mentorship_users_email_key'
  ) THEN
    ALTER TABLE mentorship_users ADD CONSTRAINT mentorship_users_email_key UNIQUE (email);
  END IF;
EXCEPTION
  WHEN duplicate_table THEN NULL;
END $$;

-- Add enhanced submission fields to mentorship_submissions
ALTER TABLE mentorship_submissions
  ADD COLUMN IF NOT EXISTS repo_url TEXT,
  ADD COLUMN IF NOT EXISTS demo_url TEXT,
  ADD COLUMN IF NOT EXISTS notes TEXT,
  ADD COLUMN IF NOT EXISTS feedback TEXT;

-- Helpful indexes for lookup and profile queries
CREATE INDEX IF NOT EXISTS idx_mentorship_users_email ON mentorship_users(email);
