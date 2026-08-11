-- Create the assignments table (Backlog 67)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    program_id UUID NOT NULL REFERENCES public.programs(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    pdf_title VARCHAR(255),
    pdf_file_path TEXT,
    opened_date TIMESTAMPTZ,
    due_date TIMESTAMPTZ,
    highlight_text TEXT,
    instructions JSONB,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS for assignments
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;

-- Admins can manage assignments
DROP POLICY IF EXISTS "Admins can manage assignments" ON public.assignments;
CREATE POLICY "Admins can manage assignments" ON public.assignments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Tutors can manage assignments
DROP POLICY IF EXISTS "Tutors can manage assignments" ON public.assignments;
CREATE POLICY "Tutors can manage assignments" ON public.assignments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'tutor')
    );

-- Parents can view assignments for their children's program
DROP POLICY IF EXISTS "Parents can view assignments" ON public.assignments;
CREATE POLICY "Parents can view assignments" ON public.assignments
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students 
            WHERE students.parent_id = auth.uid() 
            AND students.program_id = assignments.program_id
        )
    );

-- Create the submissions table (Backlog 68)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.students(id) ON DELETE CASCADE,
    submitted_file_path TEXT NOT NULL,
    submitted_at TIMESTAMPTZ DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'submitted', -- 'submitted' or 'graded'
    score INTEGER,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(assignment_id, student_id) -- A student can only have 1 active submission per assignment
);

-- Enable RLS for submissions
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

-- Admins can manage submissions
DROP POLICY IF EXISTS "Admins can manage submissions" ON public.submissions;
CREATE POLICY "Admins can manage submissions" ON public.submissions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );

-- Tutors can manage submissions
DROP POLICY IF EXISTS "Tutors can manage submissions" ON public.submissions;
CREATE POLICY "Tutors can manage submissions" ON public.submissions
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'tutor')
    );

-- Parents can view their children's submissions
DROP POLICY IF EXISTS "Parents can view submissions" ON public.submissions;
CREATE POLICY "Parents can view submissions" ON public.submissions
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.students 
            WHERE students.id = submissions.student_id 
            AND students.parent_id = auth.uid()
        )
    );

-- Parents can insert submissions for their children
DROP POLICY IF EXISTS "Parents can insert submissions" ON public.submissions;
CREATE POLICY "Parents can insert submissions" ON public.submissions
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.students 
            WHERE students.id = submissions.student_id 
            AND students.parent_id = auth.uid()
        )
    );

-- Parents can update their children's submissions if they are still 'submitted'
DROP POLICY IF EXISTS "Parents can update own submissions" ON public.submissions;
CREATE POLICY "Parents can update own submissions" ON public.submissions
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.students 
            WHERE students.id = submissions.student_id 
            AND students.parent_id = auth.uid()
        )
        AND status = 'submitted'
    );
