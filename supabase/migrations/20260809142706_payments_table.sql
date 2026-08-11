CREATE TABLE public.payments (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id uuid REFERENCES public.students(id) ON DELETE CASCADE NOT NULL,
  amount numeric NOT NULL,
  billing_month int NOT NULL,
  payment_proof_url text,
  status text NOT NULL DEFAULT 'verified',
  verified_by uuid REFERENCES public.profiles(id),
  created_at timestamp with time zone DEFAULT now()
);

-- RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin can view all payments" ON public.payments FOR SELECT USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Admin can insert payments" ON public.payments FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);

CREATE POLICY "Parents can view their children's payments" ON public.payments FOR SELECT USING (
  student_id IN (SELECT id FROM public.students WHERE parent_id = auth.uid())
);
