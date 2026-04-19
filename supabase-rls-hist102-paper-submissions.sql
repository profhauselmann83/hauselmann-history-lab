-- =============================================================
-- Supabase RLS policies for HIST 102 final paper submissions
-- =============================================================
-- Run this file in the Supabase SQL Editor
-- (Dashboard > SQL Editor > New query > paste > Run).
--
-- Why this file exists:
--   Students submitting the Week 7 final paper at
--   hist102/online/week7/paper-submission.html were blocked with:
--     "Submission failed: new row violates row-level security
--      policy for table \"paper_submissions_102\""
--   The table exists in Supabase with Row Level Security enabled
--   but without the INSERT / SELECT / UPDATE policies that the
--   student-facing page and the admin dashboard
--   (hist102/online/admin/dashboard.html) need.
--
-- What this file does:
--   1. Creates paper_submissions_102 if it does not already exist,
--      using the column set that paper-submission.html inserts and
--      that the admin dashboard reads.
--   2. Enables RLS and adds public INSERT / SELECT / UPDATE / DELETE
--      policies so the submission page can insert a row and the
--      admin dashboard can list rows and toggle is_reviewed.
--
-- Safe to run more than once: every CREATE POLICY is preceded by a
-- DROP POLICY IF EXISTS of the same name.
-- =============================================================


-- -------------------------------------------------------------
-- 1. paper_submissions_102: create if missing
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS paper_submissions_102 (
  id               bigserial PRIMARY KEY,
  student_name     text,
  student_w_num    text,
  prompt_choice    text,
  paper_title      text,
  paper_text       text,
  bibliography     text,
  word_count       integer,
  pledge_signature text,
  file_path        text,
  is_reviewed      boolean DEFAULT false,
  submitted_at     timestamptz DEFAULT now()
);


-- -------------------------------------------------------------
-- 2. paper_submissions_102: public policies for all four verbs
-- -------------------------------------------------------------
ALTER TABLE paper_submissions_102 ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on paper_submissions_102"
  ON paper_submissions_102;
DROP POLICY IF EXISTS "Allow public read on paper_submissions_102"
  ON paper_submissions_102;
DROP POLICY IF EXISTS "Allow public update on paper_submissions_102"
  ON paper_submissions_102;
DROP POLICY IF EXISTS "Allow public delete on paper_submissions_102"
  ON paper_submissions_102;

CREATE POLICY "Allow public insert on paper_submissions_102"
  ON paper_submissions_102 FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on paper_submissions_102"
  ON paper_submissions_102 FOR SELECT USING (true);

CREATE POLICY "Allow public update on paper_submissions_102"
  ON paper_submissions_102 FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on paper_submissions_102"
  ON paper_submissions_102 FOR DELETE USING (true);


-- =============================================================
-- VERIFY after running:
--   SELECT tablename, policyname, cmd
--   FROM pg_policies
--   WHERE tablename = 'paper_submissions_102'
--   ORDER BY cmd;
-- You should see INSERT, SELECT, UPDATE, and DELETE.
-- =============================================================
