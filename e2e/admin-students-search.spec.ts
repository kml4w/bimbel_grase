import { test, expect } from '@playwright/test';

test.describe('Admin Students Search Filter', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    
    // Check if we are already logged in (redirected to /admin)
    if (page.url().includes('/admin')) {
      await page.goto('/admin/students');
      return;
    }

    // Login as Admin
    await page.fill('input[type="email"]', 'admin@grase.com');
    await page.fill('input[type="password"]', 'admin123');
    await page.click('button[type="submit"]');

    // Wait for redirect away from login
    await page.waitForURL(url => !url.href.includes('/login'));
    
    // Go to Students page
    await page.goto('/admin/students');
    
    // Wait for the table to load
    await page.waitForSelector('table');
  });

  test('Pencarian berdasarkan sebagian nama siswa', async ({ page }) => {
    // Get initial row count
    const initialRows = await page.locator('tbody tr').count();
    expect(initialRows).toBeGreaterThan(0);

    // Get the name of the first student to search
    const firstStudentName = await page.locator('tbody tr:first-child td:first-child div').textContent();
    
    // Take a substring to search (e.g., first 3 characters)
    const searchQuery = firstStudentName?.substring(0, 3) || '';

    // Type in search box
    await page.fill('input[placeholder*="Cari nama siswa"]', searchQuery);

    // Wait for a short moment since it's client side filtering
    await page.waitForTimeout(300);

    // Verify the rows contain the search query
    const filteredRows = await page.locator('tbody tr').count();
    expect(filteredRows).toBeGreaterThan(0);
    
    const firstFilteredName = await page.locator('tbody tr:first-child td:first-child div').textContent();
    expect(firstFilteredName?.toLowerCase()).toContain(searchQuery.toLowerCase());
  });

  test('Pencarian menampilkan teks "Tidak ada data" jika tidak ditemukan', async ({ page }) => {
    // Type random non-existent string
    await page.fill('input[placeholder*="Cari nama siswa"]', 'xyz_tidak_ada_nama_seperti_ini_123');

    // Wait for filter
    await page.waitForTimeout(300);

    // Verify empty state message
    const emptyMessage = await page.locator('tbody tr td').textContent();
    expect(emptyMessage).toContain('Tidak ada data siswa yang cocok dengan pencarian Anda.');
  });

});
