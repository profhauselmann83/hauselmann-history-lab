-- =============================================================
-- Supabase RLS Policies for worksheet_submissions table
-- and student-submissions storage bucket
-- =============================================================
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
--
-- These policies allow worksheet pages (Galileo Investigation,
-- HIST 101 Research Worksheets, HIST 107 Components, etc.) to:
--   1. Upload PDFs to the student-submissions storage bucket
--   2. Insert submission records into worksheet_submissions
--
-- The submissions dashboard reads and updates these records,
-- so SELECT and UPDATE policies are included as well.
-- =============================================================


-- =============================================================
-- PART 1: worksheet_submissions TABLE POLICIES
-- =============================================================

-- 1. Enable Row Level Security on the table (if not already enabled)
ALTER TABLE worksheet_submissions ENABLE ROW LEVEL SECURITY;

-- 2. Allow anyone to insert worksheet submissions
--    (needed by all student worksheet pages using the anon key)
CREATE POLICY "Allow public insert on worksheet_submissions"
  ON worksheet_submissions
  FOR INSERT
  WITH CHECK (true);

-- 3. Allow anyone to read worksheet submissions
--    (needed by the submissions dashboard)
CREATE POLICY "Allow public read on worksheet_submissions"
  ON worksheet_submissions
  FOR SELECT
  USING (true);

-- 4. Allow anyone to update worksheet submissions
--    (needed by the submissions dashboard to toggle is_reviewed / is_downloaded)
CREATE POLICY "Allow public update on worksheet_submissions"
  ON worksheet_submissions
  FOR UPDATE
  USING (true)
  WITH CHECK (true);


-- =============================================================
-- PART 2: student-submissions STORAGE BUCKET POLICIES
-- =============================================================
-- Storage policies are on the storage.objects table and are
-- scoped to the bucket via the bucket_id column.
-- =============================================================

-- 5. Allow anyone to upload files to the student-submissions bucket
CREATE POLICY "Allow public upload to student-submissions"
  ON storage.objects
  FOR INSERT
  WITH CHECK (bucket_id = 'student-submissions');

-- 6. Allow anyone to read/download files from the student-submissions bucket
--    (needed by the dashboard to access submitted PDFs)
CREATE POLICY "Allow public read from student-submissions"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'student-submissions');


-- =============================================================
-- VERIFICATION: Run these queries to confirm the policies exist
-- =============================================================
-- Check worksheet_submissions policies:
--   SELECT policyname, cmd, qual, with_check
--   FROM pg_policies
--   WHERE tablename = 'worksheet_submissions';
--
-- Check storage policies:
--   SELECT policyname, cmd, qual, with_check
--   FROM pg_policies
--   WHERE tablename = 'objects' AND schemaname = 'storage';
-- =============================================================


-- =============================================================
-- TROUBLESHOOTING
-- =============================================================
-- If you get "policy already exists" errors, drop the conflicting
-- policies first:
--
--   DROP POLICY IF EXISTS "Allow public insert on worksheet_submissions"
--     ON worksheet_submissions;
--   DROP POLICY IF EXISTS "Allow public read on worksheet_submissions"
--     ON worksheet_submissions;
--   DROP POLICY IF EXISTS "Allow public update on worksheet_submissions"
--     ON worksheet_submissions;
--   DROP POLICY IF EXISTS "Allow public upload to student-submissions"
--     ON storage.objects;
--   DROP POLICY IF EXISTS "Allow public read from student-submissions"
--     ON storage.objects;
--
-- Then re-run this file.
--
-- If policies exist that restrict to authenticated users only,
-- list them with:
--   SELECT policyname FROM pg_policies
--   WHERE tablename = 'worksheet_submissions';
--   SELECT policyname FROM pg_policies
--   WHERE tablename = 'objects' AND schemaname = 'storage';
-- =============================================================
