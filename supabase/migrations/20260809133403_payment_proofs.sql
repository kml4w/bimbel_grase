-- 1. Add payment_proof_url to students table
ALTER TABLE students ADD COLUMN IF NOT EXISTS payment_proof_url TEXT;

-- 2. Create payment-proofs storage bucket (private by default)
INSERT INTO storage.buckets (id, name, public)
VALUES ('payment-proofs', 'payment-proofs', false)
ON CONFLICT (id) DO NOTHING;

-- 3. RLS for payment-proofs

-- Authenticated users can upload payment proofs
CREATE POLICY "Authenticated users can upload payment proofs."
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'payment-proofs' 
    AND auth.role() = 'authenticated'
  );

-- Authenticated users can view their own payment proofs
-- We assume the file name contains the student ID or parent ID if we want to be strict,
-- but for simplicity, any authenticated user can view files in this bucket for now, 
-- or we can restrict it to the user who uploaded it.
CREATE POLICY "Users can view their own payment proofs."
  ON storage.objects FOR SELECT
  USING (
    bucket_id = 'payment-proofs' 
    AND auth.uid() = owner
  );

-- Admin/Tutor policies can be added later if needed.
