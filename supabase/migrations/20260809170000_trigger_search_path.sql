CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  student_record jsonb;
BEGIN
  -- 1. Insert ke profiles (sesuaikan dengan skema asli, hanya id yang wajib)
  INSERT INTO public.profiles (id, full_name, role)
  VALUES (
    new.id, 
    new.raw_user_meta_data->>'full_name', 
    COALESCE(new.raw_user_meta_data->>'role', 'parent')
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
