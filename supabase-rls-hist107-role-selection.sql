-- =============================================================
-- Supabase RLS Policies for hist107_role_selection
-- =============================================================
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor)
--
-- These policies allow the commodity role selection form to
-- insert, update, and delete rows using the anon key (no login
-- required), so student submissions appear on the student and
-- admin dashboards.
-- =============================================================

-- 1. Enable Row Level Security on the table (if not already enabled)
ALTER TABLE hist107_role_selection ENABLE ROW LEVEL SECURITY;

-- 2. Allow anyone to read all role selections
--    (needed by student dashboard and admin dashboard)
CREATE POLICY "Allow public read access on hist107_role_selection"
  ON hist107_role_selection
  FOR SELECT
  USING (true);

-- 3. Allow anyone to insert role selections
--    (needed by the commodity role selection form for all students)
CREATE POLICY "Allow public insert on hist107_role_selection"
  ON hist107_role_selection
  FOR INSERT
  WITH CHECK (true);

-- 4. Allow anyone to update their own role selection
--    (needed by saveWork() upsert for logged-in users)
CREATE POLICY "Allow public update on hist107_role_selection"
  ON hist107_role_selection
  FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- 5. Allow anyone to delete role selections
--    (needed by the delete-then-insert pattern for unauthenticated students)
CREATE POLICY "Allow public delete on hist107_role_selection"
  ON hist107_role_selection
  FOR DELETE
  USING (true);

-- =============================================================
-- VERIFICATION: Run this query to confirm the policies exist
-- =============================================================
-- SELECT policyname, cmd, qual, with_check
-- FROM pg_policies
-- WHERE tablename = 'hist107_role_selection';
-- =============================================================

-- =============================================================
-- NOTE: If you already have existing policies on this table that
-- conflict (e.g., policies that restrict to authenticated users),
-- you may need to drop them first:
--
--   DROP POLICY IF EXISTS "policy_name_here" ON hist107_role_selection;
--
-- To see existing policies:
--   SELECT policyname FROM pg_policies WHERE tablename = 'hist107_role_selection';
-- =============================================================
