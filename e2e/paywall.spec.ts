import { test, expect } from '@playwright/test';

test.describe('Paywall Guard - Backlog 64', () => {
  // Test 1: Siswa unpaid/pending tidak bisa akses LMS (Muncul Paywall)
  test('Siswa unpaid/pending tidak bisa mengakses data LMS', async ({ page }) => {
    // 1. Buat akun parent baru agar datanya bersih
    const timestamp = Date.now();
    const testEmail = `parent_${timestamp}@test.com`;
    const testPassword = 'Password123!';
    
    await page.goto('/register');
    await page.fill('input[name="fullName"]', 'Test Parent Unpaid');
    await page.fill('input[name="phone"]', '081234567890');
    await page.fill('input[name="email"]', testEmail);
    await page.fill('input[name="password"]', testPassword);
    await page.fill('input[name="confirmPassword"]', testPassword);
    await page.click('button[type="submit"]');

    // Tunggu redirect ke login atau dashboard, asumsikan redirect ke login
    await page.waitForURL(/\/dashboard|\/login/, { timeout: 15000 });
    
    // Jika diarahkan ke login, login
    if (page.url().includes('/login')) {
      await page.fill('input[type="email"]', testEmail);
      await page.fill('input[type="password"]', testPassword);
      await page.click('button[type="submit"]');
      await page.waitForURL(/\/dashboard/, { timeout: 10000 });
    }
    
    // Verifikasi di Dashboard
    await expect(page).toHaveURL(/\/dashboard/);
    
    // 2. Tambah anak
    await page.click('button:has-text("Tambah Data Anak")');
    // Tunggu modal muncul
    await page.waitForSelector('text=Daftarkan Anak', { state: 'visible' });
    
    await page.fill('input[name="studentName"]', 'Anak Unpaid Test');
    await page.fill('input[name="age"]', '10');
    // Pilih program pertama yang ada
    await page.selectOption('select[name="programId"]', { index: 1 });
    await page.click('button[type="submit"]:has-text("Daftarkan")');
    
    // Tunggu modal tertutup dan data muncul
    await page.waitForSelector('text=Anak Unpaid Test', { state: 'visible', timeout: 10000 });
    
    // 3. Verifikasi status tagihan SPP = Belum Bayar
    await expect(page.locator('text=Belum Bayar')).toBeVisible();

    // 4. Verifikasi komponen Paywall (Akses E-Learning Terkunci) muncul
    await expect(page.locator('text=Akses E-Learning Terkunci')).toBeVisible();
    await expect(page.locator('text=Ke Halaman Pembayaran')).toBeVisible();
  });

  // Test 2: Siswa verified bisa akses penuh LMS
  test('Siswa verified bisa akses penuh LMS', async ({ browser }) => {
    // Untuk ngetes verified, kita harus approve dari sisi Admin. 
    // Jadi alurnya: Register Parent -> Tambah Anak -> Login Admin -> Approve -> Cek Parent lagi.
    
    const contextParent = await browser.newContext();
    const pageParent = await contextParent.newPage();
    
    const timestamp = Date.now();
    const testEmail = `parent_verif_${timestamp}@test.com`;
    const testPassword = 'Password123!';
    
    // --- 1. Parent Register & Tambah Anak ---
    await pageParent.goto('/register');
    await pageParent.fill('input[name="fullName"]', 'Test Parent Verif');
    await pageParent.fill('input[name="phone"]', '081234567891');
    await pageParent.fill('input[name="email"]', testEmail);
    await pageParent.fill('input[name="password"]', testPassword);
    await pageParent.fill('input[name="confirmPassword"]', testPassword);
    await pageParent.click('button[type="submit"]');

    await pageParent.waitForURL(/\/dashboard|\/login/);
    if (pageParent.url().includes('/login')) {
      await pageParent.fill('input[type="email"]', testEmail);
      await pageParent.fill('input[type="password"]', testPassword);
      await pageParent.click('button[type="submit"]');
      await pageParent.waitForURL(/\/dashboard/);
    }
    
    await pageParent.click('button:has-text("Tambah Data Anak")');
    await pageParent.waitForSelector('text=Daftarkan Anak');
    await pageParent.fill('input[name="studentName"]', 'Anak Verified Test');
    await pageParent.fill('input[name="age"]', '12');
    await pageParent.selectOption('select[name="programId"]', { index: 1 });
    await pageParent.click('button[type="submit"]:has-text("Daftarkan")');
    
    await pageParent.waitForSelector('text=Anak Verified Test');
    
    // Parent upload bukti bayar
    await pageParent.click('text=Belum Bayar');
    await pageParent.waitForURL(/\/parent\/payment/);
    
    // Upload dummy file
    const buffer = Buffer.from('dummy image content');
    await pageParent.setInputFiles('input[type="file"]', {
      name: 'dummy.jpg',
      mimeType: 'image/jpeg',
      buffer
    });
    await pageParent.click('button:has-text("Kirim Bukti Pembayaran")');
    await pageParent.waitForSelector('text=Diproses Admin');
    
    // --- 2. Admin Approve ---
    const contextAdmin = await browser.newContext();
    const pageAdmin = await contextAdmin.newPage();
    await pageAdmin.goto('/login');
    await pageAdmin.fill('input[type="email"]', 'admin@grase.com');
    await pageAdmin.fill('input[type="password"]', 'Password123!');
    await pageAdmin.click('button[type="submit"]');
    
    await pageAdmin.waitForURL(/\/admin/);
    await pageAdmin.goto('/admin/finance');
    
    // Approve pembayaran Anak Verified Test
    const row = pageAdmin.locator(`tr:has-text("Anak Verified Test")`);
    await row.locator('button[title="Setujui Pembayaran"]').click();
    
    // Tunggu konfirmasi selesai
    await pageAdmin.waitForTimeout(2000);
    
    // --- 3. Parent Cek LMS ---
    await pageParent.goto('/dashboard');
    
    // Verifikasi paywall tidak ada, diganti dengan Guided E-Learning LMS
    await expect(pageParent.locator('text=Akses E-Learning Terkunci')).not.toBeVisible();
    await expect(pageParent.locator('text=Guided E-Learning LMS')).toBeVisible();
    await expect(pageParent.locator('text=Modul Pembelajaran (Fase 4) akan segera hadir di sini.')).toBeVisible();
    
    await contextParent.close();
    await contextAdmin.close();
  });
});
