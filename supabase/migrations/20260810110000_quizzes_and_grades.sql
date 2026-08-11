-- Migration tabel quizzes (Backlog 69)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    questions_count INTEGER NOT NULL DEFAULT 0,
    duration INTEGER NOT NULL, -- in minutes
    questions JSONB NOT NULL DEFAULT '[]'::jsonb, -- array of {id, text, options:{A,B,C}, key}
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for quizzes
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;

-- Admins and Tutors can manage quizzes
CREATE POLICY "Admins and tutors can manage quizzes" ON public.quizzes
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'tutor'))
    );

-- Parents/Students can view quizzes for their program
CREATE POLICY "Parents can view quizzes" ON public.quizzes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students 
            WHERE students.parent_id = auth.uid() 
            AND students.program_id = quizzes.program_id
        )
    );

-- Migration tabel grades (Backlog 70)
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    task_name VARCHAR(255) NOT NULL, -- e.g. "Tugas Matematika Bab 1" or "Kuis Akhir Bulan"
    score INTEGER NOT NULL,
    grade_letter VARCHAR(2) NOT NULL, -- 'A', 'B', 'C'
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for grades
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;

-- Admins and Tutors can manage grades
CREATE POLICY "Admins and tutors can manage grades" ON public.grades
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role IN ('admin', 'tutor'))
    );

-- Parents can view their children's grades
CREATE POLICY "Parents can view grades" ON public.grades
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students 
            WHERE students.id = grades.student_id 
            AND students.parent_id = auth.uid()
        )
    );
