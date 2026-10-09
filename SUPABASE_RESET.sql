-- ============================================================
-- CODE WEAVE PLANET — DATABASE WIPE & RESET SCRIPT
-- RUN THIS IN SUPABASE SQL EDITOR TO CLEANLY DELETE EVERYTHING
-- ============================================================

-- 1. Drop trigger on auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- 2. Drop triggers on public tables
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;

-- 3. Drop helper functions
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.get_my_role() CASCADE;

-- 4. Drop all application tables (CASCADE cleans foreign key dependencies)
DROP TABLE IF EXISTS public.applications CASCADE;
DROP TABLE IF EXISTS public.resources CASCADE;
DROP TABLE IF EXISTS public.enrollments CASCADE;
DROP TABLE IF EXISTS public.courses CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 5. Drop storage bucket policies (bucket itself is preserved safely for reuse)
DROP POLICY IF EXISTS "Avatars publicly readable" ON storage.objects;
DROP POLICY IF EXISTS "Auth users can upload avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;

-- Completed: Database is now completely clean and ready for a fresh schema!
