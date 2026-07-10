const { test, expect } = require('@playwright/test');

test.describe('Authentication Flow', () => {

  const testUser = `user${Date.now()}`;
  const testPass = 'Password123';

  test('E2E_AUTH_01: Đăng ký thành công với thông tin hợp lệ', async ({ page }) => {
    await page.goto('/register');
    
    // Điền thông tin
    await page.locator('input[name="username"]').fill(testUser);
    await page.locator('input[name="password"]').fill(testPass);
    await page.locator('input[name="confirmPassword"]').fill(testPass);
    
    // Submit
    await page.getByRole('button', { name: /đăng ký/i }).click();

    // Sẽ redirect sang trang chủ (/todos) do AuthContext cập nhật user và navigate
    // Wait, trong code Register.jsx: navigate('/todos');
    await expect(page).toHaveURL(/\/todos/);
  });

  test('E2E_AUTH_02: Đăng ký với Username đã tồn tại', async ({ page }) => {
    // Admin user đã được seed sẵn
    await page.goto('/register');
    
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('admin123');
    await page.locator('input[name="confirmPassword"]').fill('admin123');
    
    // Bắt sự kiện Alert của window
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Username already exists');
      await dialog.dismiss();
    });

    await page.getByRole('button', { name: /đăng ký/i }).click();
  });

  test('E2E_AUTH_03: Đăng nhập thành công', async ({ page }) => {
    await page.goto('/login');
    
    // Dùng tài khoản guest đã được seed
    await page.locator('input[name="username"]').fill('guest');
    await page.locator('input[name="password"]').fill('guest123');
    
    await page.getByRole('button', { name: /đăng nhập/i }).click();

    await expect(page).toHaveURL(/\/todos/);
    await expect(page.locator('text=Xin chào, guest')).toBeVisible();
  });

  test('E2E_AUTH_04: Đăng nhập với mật khẩu sai', async ({ page }) => {
    await page.goto('/login');
    
    await page.locator('input[name="username"]').fill('guest');
    await page.locator('input[name="password"]').fill('wrongpass1');
    
    page.on('dialog', async dialog => {
      expect(dialog.message()).toContain('Invalid credentials');
      await dialog.dismiss();
    });

    await page.getByRole('button', { name: /đăng nhập/i }).click();
  });

  test('E2E_AUTH_05: Nhập mật khẩu không đủ 6 ký tự (Validation)', async ({ page }) => {
    await page.goto('/login');
    
    await page.locator('input[name="username"]').fill('guest');
    await page.locator('input[name="password"]').fill('123'); 
    
    await page.getByRole('button', { name: /đăng nhập/i }).click();

    // Form không submit, UI sẽ hiện chữ đỏ
    await expect(page.locator('text=Mật khẩu ít nhất 6 ký tự')).toBeVisible();
  });

});
