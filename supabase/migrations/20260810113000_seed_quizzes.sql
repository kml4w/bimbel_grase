-- Script ini akan menambahkan sebuah kuis dummy ke setiap program kelas yang ada di database.
-- Jalankan ini di Supabase SQL Editor.

DO $$ 
DECLARE
  p_record RECORD;
BEGIN
  -- Looping ke setiap program yang ada
  FOR p_record IN SELECT id FROM public.programs LOOP
    -- Cek apakah sudah ada kuis untuk program ini, agar tidak terduplikasi jika dijalankan ulang
    IF NOT EXISTS (SELECT 1 FROM public.quizzes WHERE program_id = p_record.id AND title = 'Kuis Latihan Pemahaman Bab 1') THEN
      INSERT INTO public.quizzes (program_id, title, questions_count, duration, questions)
      VALUES (
        p_record.id,
        'Kuis Latihan Pemahaman Bab 1',
        3,
        2, -- 2 menit saja agar user cepat melihat auto-submit saat tes
        '[
          {
            "id": "q1",
            "text": "Apa ibu kota negara Republik Indonesia saat ini?",
            "options": {
              "A": "Surabaya",
              "B": "Jakarta",
              "C": "Bandung"
            },
            "key": "B"
          },
          {
            "id": "q2",
            "text": "Berapakah hasil dari 25 + 15?",
            "options": {
              "A": "30",
              "B": "45",
              "C": "40"
            },
            "key": "C"
          },
          {
            "id": "q3",
            "text": "Siapakah presiden pertama Republik Indonesia?",
            "options": {
              "A": "B.J. Habibie",
              "B": "Soeharto",
              "C": "Ir. Soekarno"
            },
            "key": "C"
          }
        ]'::jsonb
      );
    END IF;
  END LOOP;
END $$;
