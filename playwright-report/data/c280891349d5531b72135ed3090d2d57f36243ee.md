# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: admin-students-search.spec.ts >> Admin Students Search Filter >> Pencarian menampilkan teks "Tidak ada data" jika tidak ditemukan
- Location: e2e\admin-students-search.spec.ts:55:7

# Error details

```
Test timeout of 30000ms exceeded while running "beforeEach" hook.
```

```
Error: page.waitForURL: Test timeout of 30000ms exceeded.
=========================== logs ===========================
waiting for navigation until "load"
============================================================
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - banner [ref=e2]:
    - link "school Bimbel Grase" [ref=e4] [cursor=pointer]:
      - /url: /
      - generic [ref=e5]: school
      - generic [ref=e7]: Bimbel Grase
    - navigation [ref=e9]:
      - generic [ref=e10]:
        - link "Home" [ref=e11] [cursor=pointer]:
          - /url: /
        - link "Pendaftaran" [ref=e12] [cursor=pointer]:
          - /url: /register
    - link "login Masuk" [ref=e14] [cursor=pointer]:
      - /url: /login
      - generic [ref=e15]: login
      - text: Masuk
  - main [ref=e16]:
    - generic [ref=e18]:
      - generic [ref=e19]:
        - generic [ref=e20]: lock_person
        - heading "Masuk ke Akun" [level=2] [ref=e22]
        - paragraph [ref=e23]: Gunakan email orang tua atau kredensial staf
      - generic [ref=e24]:
        - generic [ref=e25]: error
        - text: Invalid login credentials
      - generic [ref=e26]:
        - generic [ref=e27]:
          - generic [ref=e28]: Email
          - textbox "nama@email.com" [ref=e29]: admin@grase.com
        - generic [ref=e30]:
          - generic [ref=e31]:
            - generic [ref=e32]: Password
            - link "Lupa Sandi?" [ref=e33] [cursor=pointer]:
              - /url: /forgot-password
          - textbox "••••••••" [ref=e34]: admin123
        - button "login Masuk" [ref=e35]:
          - generic [ref=e36]: login
          - text: Masuk
      - paragraph [ref=e37]:
        - text: Belum punya akun?
        - link "Daftar Sekarang" [ref=e38] [cursor=pointer]:
          - /url: /register
  - contentinfo [ref=e39]:
    - generic [ref=e40]:
      - generic [ref=e41]:
        - link "school Bimbel Grase" [ref=e42] [cursor=pointer]:
          - /url: /
          - generic [ref=e43]: school
          - generic [ref=e45]: Bimbel Grase
        - paragraph [ref=e46]: Lembaga Bimbingan Belajar interaktif & terpercaya. Membantu tumbuh kembang prestasi akademik dan fondasi pembelajaran siswa Indonesia.
        - generic [ref=e47]:
          - generic [ref=e48]: verified
          - generic [ref=e49]: Terakreditasi & Terdaftar Resmi
      - generic [ref=e50]:
        - heading "contact_support Contact Person & Layanan" [level=4] [ref=e51]:
          - generic [ref=e52]: contact_support
          - text: Contact Person & Layanan
        - list [ref=e53]:
          - listitem [ref=e54]:
            - generic [ref=e55]: call
            - generic [ref=e56]:
              - generic [ref=e57]: "WhatsApp CS / Hotline:"
              - link "+62 812-3456-7890 (Bunda Admin)" [ref=e58] [cursor=pointer]:
                - /url: https://wa.me/6281234567890
          - listitem [ref=e59]:
            - generic [ref=e60]: mail
            - generic [ref=e61]:
              - generic [ref=e62]: "Email Layanan:"
              - text: info@bimbelgrase.sch.id
          - listitem [ref=e63]:
            - generic [ref=e64]: location_on
            - generic [ref=e65]:
              - generic [ref=e66]: "Alamat Pusat:"
              - text: Jl. Pendidikan No. 45, Komplek Grase Learning Center, Jakarta
          - listitem [ref=e67]:
            - generic [ref=e68]: schedule
            - generic [ref=e69]:
              - generic [ref=e70]: "Jam Operasional:"
              - text: Senin - Sabtu (08:00 - 17:00 WIB)
      - generic [ref=e71]:
        - heading "Program Belajar" [level=4] [ref=e72]
        - list [ref=e73]:
          - listitem [ref=e74]:
            - link "• Super Calistung (Toddler 4-5 Thn)" [ref=e75] [cursor=pointer]:
              - /url: /register
          - listitem [ref=e76]:
            - link "• Pendampingan SD (Mata Pelajaran)" [ref=e77] [cursor=pointer]:
              - /url: /register
          - listitem [ref=e78]:
            - link "• Persiapan Ujian & Olimpiade" [ref=e79] [cursor=pointer]:
              - /url: /register
          - listitem [ref=e80]:
            - link "• Kelas Privat Online & Offline" [ref=e81] [cursor=pointer]:
              - /url: /register
      - generic [ref=e82]:
        - heading "Akses Cepat Portal" [level=4] [ref=e83]
        - list [ref=e84]:
          - listitem [ref=e85]:
            - link "• Halaman Utama" [ref=e86] [cursor=pointer]:
              - /url: /
          - listitem [ref=e87]:
            - link "• Masuk Portal Orang Tua" [ref=e88] [cursor=pointer]:
              - /url: /login
          - listitem [ref=e89]:
            - link "• Profil & Edit Foto Profil Anak" [ref=e90] [cursor=pointer]:
              - /url: /children
          - listitem [ref=e91]:
            - link "• Pembayaran SPP Bulanan" [ref=e92] [cursor=pointer]:
              - /url: /payments
    - generic [ref=e94]:
      - paragraph [ref=e95]: © 2026 Bimbel Grase. Seluruh Hak Cipta Dilindungi Undang-Undang.
      - generic [ref=e96]:
        - button "Kebijakan Privasi" [ref=e97]
        - generic [ref=e98]: •
        - button "Syarat & Ketentuan" [ref=e99]
  - button "Open Next.js Dev Tools" [ref=e105] [cursor=pointer]
  - alert [ref=e109]
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test.describe('Admin Students Search Filter', () => {
  4  |   
  5  |   test.beforeEach(async ({ page }) => {
  6  |     // Navigate to login
  7  |     await page.goto('/login');
  8  |     
  9  |     // Check if we are already logged in (redirected to /admin)
  10 |     if (page.url().includes('/admin')) {
  11 |       await page.goto('/admin/students');
  12 |       return;
  13 |     }
  14 | 
  15 |     // Login as Admin
  16 |     await page.fill('input[type="email"]', 'admin@grase.com');
  17 |     await page.fill('input[type="password"]', 'admin123');
  18 |     await page.click('button[type="submit"]');
  19 | 
  20 |     // Wait for redirect away from login
> 21 |     await page.waitForURL(url => !url.href.includes('/login'));
     |                ^ Error: page.waitForURL: Test timeout of 30000ms exceeded.
  22 |     
  23 |     // Go to Students page
  24 |     await page.goto('/admin/students');
  25 |     
  26 |     // Wait for the table to load
  27 |     await page.waitForSelector('table');
  28 |   });
  29 | 
  30 |   test('Pencarian berdasarkan sebagian nama siswa', async ({ page }) => {
  31 |     // Get initial row count
  32 |     const initialRows = await page.locator('tbody tr').count();
  33 |     expect(initialRows).toBeGreaterThan(0);
  34 | 
  35 |     // Get the name of the first student to search
  36 |     const firstStudentName = await page.locator('tbody tr:first-child td:first-child div').textContent();
  37 |     
  38 |     // Take a substring to search (e.g., first 3 characters)
  39 |     const searchQuery = firstStudentName?.substring(0, 3) || '';
  40 | 
  41 |     // Type in search box
  42 |     await page.fill('input[placeholder*="Cari nama siswa"]', searchQuery);
  43 | 
  44 |     // Wait for a short moment since it's client side filtering
  45 |     await page.waitForTimeout(300);
  46 | 
  47 |     // Verify the rows contain the search query
  48 |     const filteredRows = await page.locator('tbody tr').count();
  49 |     expect(filteredRows).toBeGreaterThan(0);
  50 |     
  51 |     const firstFilteredName = await page.locator('tbody tr:first-child td:first-child div').textContent();
  52 |     expect(firstFilteredName?.toLowerCase()).toContain(searchQuery.toLowerCase());
  53 |   });
  54 | 
  55 |   test('Pencarian menampilkan teks "Tidak ada data" jika tidak ditemukan', async ({ page }) => {
  56 |     // Type random non-existent string
  57 |     await page.fill('input[placeholder*="Cari nama siswa"]', 'xyz_tidak_ada_nama_seperti_ini_123');
  58 | 
  59 |     // Wait for filter
  60 |     await page.waitForTimeout(300);
  61 | 
  62 |     // Verify empty state message
  63 |     const emptyMessage = await page.locator('tbody tr td').textContent();
  64 |     expect(emptyMessage).toContain('Tidak ada data siswa yang cocok dengan pencarian Anda.');
  65 |   });
  66 | 
  67 | });
  68 | 
```