-- 1. Create assignment-materials bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('assignment-materials', 'assignment-materials', false)
ON CONFLICT (id) DO NOTHING;

-- 2. Create student-submissions bucket (private)
INSERT INTO storage.buckets (id, name, public)
VALUES ('student-submissions', 'student-submissions', false)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS for assignment-materials

-- Admins/Tutors can upload/manage assignment materials
CREATE POLICY "Admins and tutors can manage assignment materials"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'assignment-materials' 
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'tutor'))
  );

-- Authenticated users (parents/students) can view/download assignment materials
CREATE POLICY "Authenticated users can view assignment materials"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'assignment-materials' 
    AND auth.role() = 'authenticated'
  );

-- 4. RLS for student-submissions

-- Parents/Students can upload their own submissions
CREATE POLICY "Users can upload their own submissions"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'student-submissions' 
    AND auth.role() = 'authenticated'
  );

-- Parents/Students can view their own submissions
CREATE POLICY "Users can view their own submissions"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'student-submissions' 
    AND auth.uid() = owner
  );

-- Admins/Tutors can view all student submissions
CREATE POLICY "Admins and tutors can view all student submissions"
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'student-submissions' 
    AND EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'tutor'))
  );
