-- =============================================================
-- Supabase RLS policies for the HIST C1002 (HIST 102) progress dashboard
-- =============================================================
-- Run this file in the Supabase SQL Editor
-- (Dashboard > SQL Editor > New query > paste > Run).
--
-- Why this file exists:
--   The progress dashboard (hist102/online/progress/index.html)
--   showed students who passed a week's gate, but none of the pages
--   they viewed. Gate entries are written to gate_entries, which
--   has working policies. Page views are written to page_views (and
--   PDF downloads to pdf_downloads), which were missing the public
--   INSERT and/or SELECT policies. With RLS enabled and no policy,
--   Supabase silently rejects the student pages' inserts and returns
--   an empty list to the dashboard, so every page cell stays blank.
--
-- What this file does:
--   1. Makes sure page_views and pdf_downloads exist with the columns
--      the course pages send and the dashboard reads.
--   2. Adds public INSERT + SELECT policies to page_views,
--      pdf_downloads, and gate_entries (gate_entries is included so
--      all three tables match; it is harmless if it already works).
--
-- Safe to run more than once: every CREATE is IF NOT EXISTS and every
-- CREATE POLICY is preceded by a DROP POLICY IF EXISTS of the same name.
--
-- Optional check BEFORE running (shows what policies exist now):
--   SELECT tablename, policyname, cmd FROM pg_policies
--   WHERE tablename IN ('page_views','pdf_downloads','gate_entries');
-- =============================================================


-- -------------------------------------------------------------
-- 1. page_views: one row each time a student opens a course page
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS page_views (
  id             bigserial PRIMARY KEY,
  student_name   text,
  student_w_num  text,
  week_id        text,
  page           text,
  viewed_at      timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE page_views ADD COLUMN IF NOT EXISTS student_name  text;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS student_w_num text;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS week_id       text;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS page          text;
ALTER TABLE page_views ADD COLUMN IF NOT EXISTS viewed_at     timestamptz NOT NULL DEFAULT now();

ALTER TABLE page_views ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on page_views" ON page_views;
CREATE POLICY "Allow public insert on page_views"
  ON page_views
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on page_views" ON page_views;
CREATE POLICY "Allow public select on page_views"
  ON page_views
  FOR SELECT
  USING (true);


-- -------------------------------------------------------------
-- 2. pdf_downloads: one row each time a student saves a notes PDF
-- -------------------------------------------------------------
CREATE TABLE IF NOT EXISTS pdf_downloads (
  id             bigserial PRIMARY KEY,
  student_name   text,
  student_w_num  text,
  week_id        text,
  answers_count  integer,
  filename       text,
  created_at     timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE pdf_downloads ADD COLUMN IF NOT EXISTS student_name  text;
ALTER TABLE pdf_downloads ADD COLUMN IF NOT EXISTS student_w_num text;
ALTER TABLE pdf_downloads ADD COLUMN IF NOT EXISTS week_id       text;
ALTER TABLE pdf_downloads ADD COLUMN IF NOT EXISTS answers_count integer;
ALTER TABLE pdf_downloads ADD COLUMN IF NOT EXISTS filename      text;
ALTER TABLE pdf_downloads ADD COLUMN IF NOT EXISTS created_at    timestamptz NOT NULL DEFAULT now();

ALTER TABLE pdf_downloads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on pdf_downloads" ON pdf_downloads;
CREATE POLICY "Allow public insert on pdf_downloads"
  ON pdf_downloads
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on pdf_downloads" ON pdf_downloads;
CREATE POLICY "Allow public select on pdf_downloads"
  ON pdf_downloads
  FOR SELECT
  USING (true);


-- -------------------------------------------------------------
-- 3. gate_entries: already working; policies added for consistency
-- -------------------------------------------------------------
ALTER TABLE gate_entries ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Allow public insert on gate_entries" ON gate_entries;
CREATE POLICY "Allow public insert on gate_entries"
  ON gate_entries
  FOR INSERT
  WITH CHECK (true);

DROP POLICY IF EXISTS "Allow public select on gate_entries" ON gate_entries;
CREATE POLICY "Allow public select on gate_entries"
  ON gate_entries
  FOR SELECT
  USING (true);


-- -------------------------------------------------------------
-- Check AFTER running: should return rows once students open pages
-- -------------------------------------------------------------
-- SELECT week_id, page, count(*) AS views, max(viewed_at) AS latest
-- FROM page_views
-- WHERE viewed_at >= '2026-10-15'
-- GROUP BY week_id, page
-- ORDER BY week_id, page;
