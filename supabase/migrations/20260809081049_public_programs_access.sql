-- Izinkan semua pengguna (termasuk anonim) untuk membaca tabel programs
CREATE POLICY "Allow public read access to programs"
ON programs
FOR SELECT
TO public
USING (true);
