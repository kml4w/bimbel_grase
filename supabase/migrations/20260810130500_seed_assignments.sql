-- Seed Data Dummy untuk Assignments (Tugas)
-- Menyisipkan 1 tugas untuk setiap program yang ada.
DO $$
DECLARE
    prog RECORD;
BEGIN
    FOR prog IN SELECT id, name FROM public.programs LOOP
        INSERT INTO public.assignments (program_id, title, pdf_title, pdf_file_path, opened_date, due_date, highlight_text, instructions)
        VALUES (
            prog.id,
            'Tugas Pemahaman - ' || prog.name,
            'Modul_Materi_Bab_1.pdf',
            NULL, -- Anggap tidak ada file dummy fisik, nanti ditangani front-end
            NOW() - INTERVAL '1 day',
            NOW() + INTERVAL '7 days',
            'Silakan pelajari materi PDF yang dilampirkan dan kerjakan latihan soal pada halaman terakhir.',
            '{"steps": ["Download modul PDF", "Kerjakan soal latihan 1-5 di buku tulis", "Foto atau scan hasil pekerjaan", "Unggah (upload) pada form di bawah ini"]}'::jsonb
        );
    END LOOP;
END $$;
