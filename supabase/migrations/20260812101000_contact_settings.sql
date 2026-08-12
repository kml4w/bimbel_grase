CREATE TABLE public.settings (
  key text PRIMARY KEY,
  value text NOT NULL,
  updated_at timestamp with time zone DEFAULT now()
);

-- Initial data
INSERT INTO public.settings (key, value) VALUES
  ('contact_whatsapp', '+62 812-3456-7890 (Bunda Admin)'),
  ('contact_email', 'info@bimbelgrase.sch.id'),
  ('contact_address', 'Jl. Pendidikan No. 45, Komplek Grase Learning Center, Jakarta'),
  ('contact_hours', 'Senin - Sabtu (08:00 - 17:00 WIB)');

-- RLS
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read settings" ON public.settings FOR SELECT USING (true);
CREATE POLICY "Admin can update settings" ON public.settings FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
);
