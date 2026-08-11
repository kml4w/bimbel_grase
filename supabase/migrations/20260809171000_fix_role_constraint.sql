-- Drop the restrictive role check constraint and add 'parent'
ALTER TABLE public.profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE public.profiles ADD CONSTRAINT profiles_role_check CHECK (role IN ('student', 'admin', 'parent'));

-- Restore full trigger logic with students array handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  student_record jsonb;
BEGIN
  -- 1. Insert ke profiles (sesuaikan dengan skema asli, hanya id yang wajib)
  INSERT INTO public.profiles (id, full_name, role, parent_name, parent_phone)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'parent'),
    new.raw_user_meta_data->>'parent_name',
    new.raw_user_meta_data->>'parent_phone'
  );

  -- 2. Loop melalui array "students" di dalam raw_user_meta_data
  IF new.raw_user_meta_data ? 'students' AND jsonb_typeof(new.raw_user_meta_data->'students') = 'array' THEN
    FOR student_record IN SELECT * FROM jsonb_array_elements(new.raw_user_meta_data->'students')
    LOOP
      INSERT INTO public.students (
        parent_id,
        student_name,
        age,
        program_id
      ) VALUES (
        new.id,
        student_record->>'student_name',
        (student_record->>'age')::integer,
        (student_record->>'program_id')::uuid
      );
    END LOOP;
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
