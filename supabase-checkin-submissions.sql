-- =============================================================
-- Create checkin_submissions table + RLS policies
-- =============================================================
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
--
-- This creates the table used by HIST 105 Check-In assignments
-- (hist105-checkin1.html through hist105-checkin4.html) to store
-- student submissions, and sets up RLS policies so the anon key
-- can insert/read/update rows.
-- =============================================================


-- =============================================================
-- PART 1: CREATE THE TABLE
-- =============================================================

CREATE TABLE IF NOT EXISTS checkin_submissions (
    id            bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    student_name  text NOT NULL,
    section       text,
    course        text DEFAULT 'HIST 105',
    checkin_number text,
    form_data     jsonb,
    file_path     text,
    submitted_at  timestamptz DEFAULT now(),
    is_reviewed   boolean DEFAULT false,
    is_downloaded boolean DEFAULT false
);


-- =============================================================
-- PART 2: RLS POLICIES
-- =============================================================

-- 1. Enable Row Level Security
ALTER TABLE checkin_submissions ENABLE ROW LEVEL SECURITY;

-- 2. Allow anyone to insert (student check-in pages use the anon key)
CREATE POLICY "Allow public insert on checkin_submissions"
  ON checkin_submissions
  FOR INSERT
  WITH CHECK (true);

-- 3. Allow anyone to read (submissions dashboard)
CREATE POLICY "Allow public read on checkin_submissions"
  ON checkin_submissions
  FOR SELECT
  USING (true);

-- 4. Allow anyone to update (dashboard toggle reviewed/downloaded)
CREATE POLICY "Allow public update on checkin_submissions"
  ON checkin_submissions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);


-- =============================================================
-- VERIFICATION
-- =============================================================
-- SELECT policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'checkin_submissions';
-- =============================================================


-- =============================================================
-- TROUBLESHOOTING
-- =============================================================
-- If you get "policy already exists" errors, drop them first:
--
--   DROP POLICY IF EXISTS "Allow public insert on checkin_submissions"
--     ON checkin_submissions;
--   DROP POLICY IF EXISTS "Allow public read on checkin_submissions"
--     ON checkin_submissions;
--   DROP POLICY IF EXISTS "Allow public update on checkin_submissions"
--     ON checkin_submissions;
--
-- Then re-run this file.
-- =============================================================
