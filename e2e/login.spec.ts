import { test, expect } from '@playwright/test';

test.describe('Autentikasi (Login)', () => {
  test('Gagal login jika kredensial salah', async ({ page }) => {
    await page.goto('/login');

    // Isi form
    await page.fill('input[type="email"]', 'wrong@example.com');
    await page.fill('input[type="password"]', 'WrongPassword123');
    
    // Klik tombol Masuk
    await page.click('button[type="submit"]');

    // Tunggu notifikasi muncul
    const toastText = page.locator('#toast-text');
    await expect(toastText).toContainText('Gagal masuk. Periksa kembali kredensial Anda.');

    // Verifikasi tetap di halaman login
    expect(page.url()).toContain('/login');
  });

  test('Sukses login sebagai Admin dan diarahkan ke halaman Admin', async ({ page }) => {
    await page.goto('/login');

    // Isi form dengan akun admin yang sudah disemai (seeded)
    await page.fill('input[type="email"]', 'admin@grase.com');
    await page.fill('input[type="password"]', 'Password123!');
    
    // Klik tombol Masuk
    await page.click('button[type="submit"]');

    // Tunggu notifikasi sukses
    const toastText = page.locator('#toast-text');
    await expect(toastText).toContainText('Login berhasil! Mengalihkan...');

    // Verifikasi URL diarahkan (secara logis middleware akan mengarahkan root '/' ke rute yang sesuai, 
    // jika admin, biasanya diarahkan ke mana? Oh, kita belum set root redirect untuk admin di middleware,
    // mari kita cek setelah redirect. 
    // Wait, in middleware: admin -> /admin/tutors or similar, parent -> /dashboard
    await page.waitForURL(/\/admin/, { timeout: 10000 });
    expect(page.url()).toContain('/admin');
  });

  test('Sukses login sebagai Orang Tua dan diarahkan ke Dashboard', async ({ page }) => {
    // Note: Pastikan sesi admin sebelumnya dihapus atau gunakan context browser baru (Playwright default isolated per test)
    await page.goto('/login');

    // Isi form dengan akun parent
    await page.fill('input[type="email"]', 'parent@example.com');
    await page.fill('input[type="password"]', 'Password123!');
    
    // Klik tombol Masuk
    await page.click('button[type="submit"]');

    // Tunggu notifikasi sukses
    const toastText = page.locator('#toast-text');
    await expect(toastText).toContainText('Login berhasil! Mengalihkan...');

    // Verifikasi URL diarahkan
    await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    expect(page.url()).toContain('/dashboard');
  });
});
