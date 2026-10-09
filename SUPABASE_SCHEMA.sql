-- ============================================================
-- CODE WEAVE PLANET — Complete Supabase Schema
-- Run this entire script in Supabase SQL Editor
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

-- Auto-create profile on new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, avatar_url)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name', ''),
    COALESCE(NULLIF(NEW.raw_user_meta_data->>'role',''), 'student'),
    COALESCE(NEW.raw_user_meta_data->>'avatar_url', '')
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    full_name = COALESCE(EXCLUDED.full_name, profiles.full_name),
    avatar_url = COALESCE(NULLIF(EXCLUDED.avatar_url,''), profiles.avatar_url);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.resources ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;

-- Helper: get current user role
CREATE OR REPLACE FUNCTION public.get_my_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- PROFILES policies
CREATE POLICY "Authenticated can view all profiles"
  ON public.profiles FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (id = auth.uid());

CREATE POLICY "Admin can update any profile"
  ON public.profiles FOR UPDATE
  USING (public.get_my_role() = 'admin');

CREATE POLICY "Admin can delete profiles"
  ON public.profiles FOR DELETE
  USING (public.get_my_role() = 'admin');

-- COURSES policies
CREATE POLICY "Authenticated can view courses"
  ON public.courses FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Tutors and admins can insert courses"
  ON public.courses FOR INSERT
  WITH CHECK (tutor_id = auth.uid() AND public.get_my_role() IN ('tutor','admin'));

CREATE POLICY "Tutor or admin can update courses"
  ON public.courses FOR UPDATE
  USING (tutor_id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "Tutor or admin can delete courses"
  ON public.courses FOR DELETE
  USING (tutor_id = auth.uid() OR public.get_my_role() = 'admin');

-- ENROLLMENTS policies
CREATE POLICY "Students see own, tutors/admins see all enrollments"
  ON public.enrollments FOR SELECT
  USING (
    student_id = auth.uid()
    OR public.get_my_role() IN ('tutor', 'admin')
  );

CREATE POLICY "Admin and tutor can insert enrollments"
  ON public.enrollments FOR INSERT
  WITH CHECK (public.get_my_role() IN ('admin', 'tutor') OR student_id = auth.uid());

CREATE POLICY "Admin and tutor can update enrollments"
  ON public.enrollments FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'tutor'));

CREATE POLICY "Admin and tutor can delete enrollments"
  ON public.enrollments FOR DELETE
  USING (public.get_my_role() IN ('admin', 'tutor'));

-- RESOURCES policies
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

CREATE POLICY "Tutors can insert resources for their courses"
  ON public.resources FOR INSERT
  WITH CHECK (tutor_id = auth.uid() AND public.get_my_role() IN ('tutor', 'admin'));

CREATE POLICY "Tutors can update own resources"
  ON public.resources FOR UPDATE
  USING (tutor_id = auth.uid() OR public.get_my_role() = 'admin');

CREATE POLICY "Tutors can delete own resources"
  ON public.resources FOR DELETE
  USING (tutor_id = auth.uid() OR public.get_my_role() = 'admin');

-- APPLICATIONS policies
CREATE POLICY "Students see own; tutors and admins see all"
  ON public.applications FOR SELECT
  USING (student_id = auth.uid() OR public.get_my_role() IN ('admin', 'tutor'));

CREATE POLICY "Students can apply"
  ON public.applications FOR INSERT
  WITH CHECK (student_id = auth.uid());

CREATE POLICY "Admins and tutors can update application status"
  ON public.applications FOR UPDATE
  USING (public.get_my_role() IN ('admin', 'tutor'));

-- ============================================================
-- STORAGE BUCKET for avatars
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('avatars', 'avatars', true)
ON CONFLICT DO NOTHING;

CREATE POLICY "Avatars publicly readable"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Auth users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

CREATE POLICY "Users can update own avatar"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'avatars' AND auth.uid()::text = (storage.foldername(name))[1]);

-- ============================================================
-- AFTER RUNNING: Set your first admin account
-- Go to Supabase > Table Editor > profiles
-- Find your email row, change 'role' column to 'admin'
-- OR run: UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
-- ============================================================
