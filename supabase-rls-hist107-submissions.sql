-- =============================================================
-- Supabase RLS policies for HIST 107 Components 1 & 2
-- =============================================================
-- Run this file in the Supabase SQL Editor
-- (Dashboard > SQL Editor > New query > paste > Run).
--
-- Why this file exists:
--   Students reported that Component 1 (Curated Mini-Archive) and
--   Component 2 (Archive Rationale) would not let them submit to
--   Professor or to the class archive, even though the PDF export
--   worked. The root cause is that the HIST 107 tables below were
--   created in Supabase with Row Level Security enabled but without
--   the INSERT / SELECT / UPDATE / DELETE policies that the student-
--   facing pages need. Every student .insert()/.delete() was being
--   silently rejected by RLS.
--
-- What this file does:
--   1. Adds a DELETE policy to worksheet_submissions so Component 1
--      can clean up a prior submission before resubmitting.
--   2. Ensures hist107_class_archive has public INSERT / SELECT /
--      UPDATE / DELETE policies so the "submit to class archive"
--      step succeeds and the professor's dashboard can read from it.
--   3. Ensures hist107_mini_archive (Component 1 draft autosave) has
--      the public policies it needs so students don't lose drafts.
--   4. Ensures hist107_archive_rationale (Component 2 draft autosave)
--      has the public policies it needs.
--
-- Safe to run more than once: every CREATE POLICY is preceded by a
-- DROP POLICY IF EXISTS of the same name.
-- =============================================================


-- -------------------------------------------------------------
-- 1. worksheet_submissions: add the missing DELETE policy
-- -------------------------------------------------------------
ALTER TABLE worksheet_submissions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public delete on worksheet_submissions"
  ON worksheet_submissions;

CREATE POLICY "Allow public delete on worksheet_submissions"
  ON worksheet_submissions
  FOR DELETE
  USING (true);


-- -------------------------------------------------------------
-- 2. hist107_class_archive: public policies for all four verbs
-- -------------------------------------------------------------
-- Create the table if it does not already exist. If it does, the
-- CREATE TABLE IF NOT EXISTS is a no-op and the policy statements
-- below still run.
CREATE TABLE IF NOT EXISTS hist107_class_archive (
  id                  bigserial PRIMARY KEY,
  student_name        text,
  section_number      text,
  commodity           text,
  analytical_lens     text,
  citation            text,
  source_type         text,
  producer            text,
  historical_question text,
  limitations         text,
  question_raised     text,
  url                 text,
  submitted_at        timestamptz DEFAULT now()
);

ALTER TABLE hist107_class_archive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on hist107_class_archive"
  ON hist107_class_archive;
DROP POLICY IF EXISTS "Allow public read on hist107_class_archive"
  ON hist107_class_archive;
DROP POLICY IF EXISTS "Allow public update on hist107_class_archive"
  ON hist107_class_archive;
DROP POLICY IF EXISTS "Allow public delete on hist107_class_archive"
  ON hist107_class_archive;

CREATE POLICY "Allow public insert on hist107_class_archive"
  ON hist107_class_archive FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on hist107_class_archive"
  ON hist107_class_archive FOR SELECT USING (true);

CREATE POLICY "Allow public update on hist107_class_archive"
  ON hist107_class_archive FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on hist107_class_archive"
  ON hist107_class_archive FOR DELETE USING (true);


-- -------------------------------------------------------------
-- 3. hist107_mini_archive: Component 1 draft autosave
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hist107_mini_archive (
  user_id        uuid PRIMARY KEY,
  student_name   text,
  section_number text,
  commodity      text,
  lens           text,
  sources        jsonb,
  updated_at     timestamptz DEFAULT now()
);

ALTER TABLE hist107_mini_archive ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on hist107_mini_archive"
  ON hist107_mini_archive;
DROP POLICY IF EXISTS "Allow public read on hist107_mini_archive"
  ON hist107_mini_archive;
DROP POLICY IF EXISTS "Allow public update on hist107_mini_archive"
  ON hist107_mini_archive;
DROP POLICY IF EXISTS "Allow public delete on hist107_mini_archive"
  ON hist107_mini_archive;

CREATE POLICY "Allow public insert on hist107_mini_archive"
  ON hist107_mini_archive FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on hist107_mini_archive"
  ON hist107_mini_archive FOR SELECT USING (true);

CREATE POLICY "Allow public update on hist107_mini_archive"
  ON hist107_mini_archive FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on hist107_mini_archive"
  ON hist107_mini_archive FOR DELETE USING (true);


-- -------------------------------------------------------------
-- 4. hist107_archive_rationale: Component 2 draft autosave
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS hist107_archive_rationale (
  user_id                uuid PRIMARY KEY,
  student_name           text,
  section_number         text,
  commodity_name         text,
  analytical_lens        text,
  group_members          text,
  submission_role        text,
  group_rationale        text,
  major_themes           text,
  power_perspective      text,
  capitalism_connections text,
  cotton_comparison      text,
  individual_reflection  text,
  unique_insights        text,
  limits_silences        text,
  updated_at             timestamptz DEFAULT now()
);

ALTER TABLE hist107_archive_rationale ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on hist107_archive_rationale"
  ON hist107_archive_rationale;
DROP POLICY IF EXISTS "Allow public read on hist107_archive_rationale"
  ON hist107_archive_rationale;
DROP POLICY IF EXISTS "Allow public update on hist107_archive_rationale"
  ON hist107_archive_rationale;
DROP POLICY IF EXISTS "Allow public delete on hist107_archive_rationale"
  ON hist107_archive_rationale;

CREATE POLICY "Allow public insert on hist107_archive_rationale"
  ON hist107_archive_rationale FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on hist107_archive_rationale"
  ON hist107_archive_rationale FOR SELECT USING (true);

CREATE POLICY "Allow public update on hist107_archive_rationale"
  ON hist107_archive_rationale FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Allow public delete on hist107_archive_rationale"
  ON hist107_archive_rationale FOR DELETE USING (true);


-- =============================================================
-- VERIFY after running:
--   SELECT tablename, policyname, cmd
--   FROM pg_policies
--   WHERE tablename IN (
--     'worksheet_submissions',
--     'hist107_class_archive',
--     'hist107_mini_archive',
--     'hist107_archive_rationale'
--   )
--   ORDER BY tablename, cmd;
-- You should see INSERT, SELECT, UPDATE, and DELETE for each table.
-- =============================================================
