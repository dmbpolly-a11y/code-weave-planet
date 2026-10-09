-- ============================================================
-- CODE WEAVE PLANET — Complete Fresh Database Schema
-- Run this entire script in Supabase SQL Editor
-- Full support for Email signup and Google OAuth logins
-- ============================================================

-- 1. PROFILES TABLE (extends auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id          UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email       TEXT NOT NULL,
  full_name   TEXT,
  phone       TEXT,
  avatar_url  TEXT,
  role        TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'tutor', 'student')),
  bio         TEXT,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'suspended', 'pending')),
  last_seen   TIMESTAMPTZ DEFAULT NOW(),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 2. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title       TEXT NOT NULL,
  description TEXT,
  tutor_id    UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  duration    TEXT,
  schedule    TEXT,
  fee         TEXT,
  status      TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'archived')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 3. ENROLLMENTS TABLE (student to course)
CREATE TABLE IF NOT EXISTS public.enrollments (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  status        TEXT NOT NULL DEFAULT 'enrolled' CHECK (status IN ('enrolled', 'completed', 'dropped')),
  enrolled_at   TIMESTAMPTZ DEFAULT NOW(),
  completed_at  TIMESTAMPTZ,
  UNIQUE(student_id, course_id)
);

-- 4. RESOURCES TABLE (links tutors post for course students)
CREATE TABLE IF NOT EXISTS public.resources (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id   UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  tutor_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  description TEXT,
  url         TEXT NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- 5. COURSE APPLICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.applications (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id    UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  course_id     UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  full_name     TEXT NOT NULL,
  email         TEXT NOT NULL,
  phone         TEXT,
  motivation    TEXT,
  status        TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  applied_at    TIMESTAMPTZ DEFAULT NOW(),
  reviewed_at   TIMESTAMPTZ,
  reviewed_by   UUID REFERENCES public.profiles(id),
  UNIQUE(student_id, course_id)
);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Bulletproof Auto-create profile trigger on signup / Google OAuth
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  v_full_name TEXT;
  v_role      TEXT;
  v_avatar    TEXT;
BEGIN
  -- Extract name from metadata or email fallback
  v_full_name := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'full_name', ''),
    NULLIF(NEW.raw_user_meta_data->>'name', ''),
    NULLIF(NEW.raw_user_meta_data->>'user_name', ''),
    split_part(COALESCE(NEW.email, 'User'), '@', 1)
  );

  -- Extract role from metadata, default to student
  v_role := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'role', ''),
    'student'
  );

  -- Validate role is in allowed list
  IF v_role NOT IN ('admin', 'tutor', 'student') THEN
    v_role := 'student';
  END IF;

  -- Extract avatar (Google provides 'picture' or 'avatar_url')
  v_avatar := COALESCE(
    NULLIF(NEW.raw_user_meta_data->>'avatar_url', ''),
    NULLIF(NEW.raw_user_meta_data->>'picture', ''),
    ''
  );

  INSERT INTO public.profiles (id, email, full_name, role, avatar_url, last_seen)
  VALUES (
    NEW.id,
    COALESCE(NEW.email, ''),
    v_full_name,
    v_role,
    v_avatar,
    NOW()
  )
  ON CONFLICT (id) DO UPDATE SET
    email      = EXCLUDED.email,
    full_name  = COALESCE(NULLIF(EXCLUDED.full_name, ''), profiles.full_name),
    avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url, ''), profiles.avatar_url),
    last_seen  = NOW();

  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Prevent auth transaction rollback if profile insert faces a transient issue
    RAISE WARNING 'handle_new_user trigger error: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

DROP TRIGGER IF EXISTS update_courses_updated_at ON public.courses;
CREATE TRIGGER update_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Helper function: get current user role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES policies
DROP POLICY IF EXISTS "Authenticated can view all profiles" ON public.profiles;
CREATE POLICY "Authenticated can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

DROP POLICY IF EXISTS "Admin can update any profile" ON public.profiles;
CREATE POLICY "Admin can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() = 'admin');

DROP POLICY IF EXISTS "Admin can delete profiles" ON public.profiles;
CREATE POLICY "Admin can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.get_my_role() = 'admin');

-- COURSES policies
DROP POLICY IF EXISTS "Authenticated can view courses" ON public.courses;
CREATE POLICY "Authenticated can view courses"
  ON public.courses FOR SELECT
  USING (auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Tutors and admins can insert courses" ON public.courses;
CREATE POLICY "Tutors and admins can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (tutor_id = auth.uid() AND public.get_my_role() IN ('tutor','admin'));

DROP POLICY IF EXISTS "Tutor or admin can update courses" ON public.courses;
CREATE POLICY "Tutor or admin can update courses"
  ON public.courses FOR UPDATE
  USING (tutor_id = auth.uid() OR public.get_my_role() = 'admin');

DROP POLICY IF EXISTS "Tutor or admin can delete courses" ON public.courses;
CREATE POLICY "Tutor or admin can delete courses"
  ON public.courses FOR DELETE
  USING (tutor_id = auth.uid() OR public.get_my_role() = 'admin');

-- ENROLLMENTS policies
DROP POLICY IF EXISTS "Students see own, tutors/admins see all enrollments" ON public.enrollments;
CREATE POLICY "Students see own, tutors/admins see all enrollments"
  ON public.enrollments FOR SELECT
  USING (student_id = auth.uid() OR public.get_my_role() IN ('tutor', 'admin'));

DROP POLICY IF EXISTS "Admin and tutor can insert enrollments" ON public.enrollments;
CREATE POLICY "Admin and tutor can insert enrollments"
  ON public.enrollments FOR INSERT
  WITH CHECK (public.get_my_role() IN ('admin', 'tutor') OR student_id = auth.uid());

DROP POLICY IF EXISTS "Admin and tutor can update enrollments" ON public.enrollments;
CREATE POLICY "Admin and tutor can update enrollments"
  ON public.enrollments FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'tutor'));

DROP POLICY IF EXISTS "Admin and tutor can delete enrollments" ON public.enrollments;
CREATE POLICY "Admin and tutor can delete enrollments"
  ON public.enrollments FOR DELETE
  USING (public.get_my_role() IN ('admin', 'tutor'));

-- RESOURCES policies
DROP POLICY IF EXISTS "Enrolled students and tutors/admins can view resources" ON public.resources;
CREATE POLICY "Enrolled students and tutors/admins can view resources"
  ON public.resources FOR SELECT
  USING (
    public.get_my_role() IN ('admin', 'tutor')
    OR EXISTS (
      SELECT 1 FROM public.enrollments
      WHERE student_id = auth.uid()
        AND course_id = resources.course_id
        AND status = 'enrolled'
    )
  );

DROP POLICY IF EXISTS "Tutors can insert resources for their courses" ON public.resources;
CREATE POLICY "Tutors can insert resources for their courses"
  ON public.resources FOR INSERT
  WITH CHECK (tutor_id = auth.uid() AND public.get_my_role() IN ('tutor', 'admin'));

DROP POLICY IF EXISTS "Tutors can update own resources" ON public.resources;
CREATE POLICY "Tutors can update own resources"
  ON public.resources FOR UPDATE
  USING (tutor_id = auth.uid() OR public.get_my_role() = 'admin');

DROP POLICY IF EXISTS "Tutors can delete own resources" ON public.resources;
CREATE POLICY "Tutors can delete own resources"
  ON public.resources FOR DELETE
  USING (tutor_id = auth.uid() OR public.get_my_role() = 'admin');

-- APPLICATIONS policies
DROP POLICY IF EXISTS "Students see own; tutors and admins see all" ON public.applications;
CREATE POLICY "Students see own; tutors and admins see all"
  ON public.applications FOR SELECT
  USING (student_id = auth.uid() OR public.get_my_role() IN ('admin', 'tutor'));

DROP POLICY IF EXISTS "Students can apply" ON public.applications;
CREATE POLICY "Students can apply"
  ON public.applications FOR INSERT
  WITH CHECK (student_id = auth.uid());

DROP POLICY IF EXISTS "Admins and tutors can update application status" ON public.applications;
CREATE POLICY "Admins and tutors can update application status"
  ON public.applications FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'tutor'));

-- ============================================================
-- STORAGE BUCKET for avatars
-- ============================================================

INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;

DROP POLICY IF EXISTS "Avatars publicly readable" ON storage.objects;
CREATE POLICY "Avatars publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

DROP POLICY IF EXISTS "Auth users can upload avatars" ON storage.objects;
CREATE POLICY "Auth users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

DROP POLICY IF EXISTS "Users can update own avatar" ON storage.objects;
CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- STARTER SAMPLE COURSES
-- ============================================================

INSERT INTO public.courses (title, description, duration, schedule, fee, status)
VALUES
  ('AI and Machine Learning', 'Build models that ship — from data cleaning to working prediction APIs with PyTorch and TensorFlow.', '12 weeks', 'Mon & Wed 6:00 PM', '800,000 UGX', 'active'),
  ('Web Design with Vite.js & React', 'Fast, modern front ends. Component-driven builds you can deploy the same week you learn them.', '8 weeks', 'Tue & Thu 5:00 PM', '600,000 UGX', 'active'),
  ('System Development with PHP Laravel', 'Backend systems that hold up in production: auth, databases, APIs, and admin panels.', '10 weeks', 'Mon, Wed, Fri 7:00 PM', '700,000 UGX', 'active'),
  ('Digital Marketing & Strategy', 'SEO, paid ads, and content strategy for businesses looking to scale their online presence.', '6 weeks', 'Saturdays 10:00 AM', '500,000 UGX', 'active'),
  ('Mobile App Development (React Native)', 'One codebase for both Android and iOS with native device performance and animations.', '14 weeks', 'Tue & Fri 6:00 PM', '900,000 UGX', 'active')
ON CONFLICT DO NOTHING;
