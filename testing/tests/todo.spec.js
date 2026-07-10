const { test, expect } = require('@playwright/test');

test.describe('Todo CRUD & Filtering Flow', () => {

  // Before each test, login as admin to get to /todos
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.locator('input[name="username"]').fill('admin');
    await page.locator('input[name="password"]').fill('admin123');
    await page.getByRole('button', { name: /đăng nhập/i }).click();
    await expect(page).toHaveURL(/\/todos/);
  });

  test('E2E_TODO_01: Tạo công việc mới hợp lệ', async ({ page }) => {
    const taskTitle = `New Task ${Date.now()}`;
    
    // Focus vào input để mở rộng form
    await page.locator('input[name="title"]').click();
    await page.locator('input[name="title"]').fill(taskTitle);
    await page.locator('textarea[name="description"]').fill('Task description');
    
    await page.getByRole('button', { name: /thêm việc/i }).click();

    // Xác nhận task mới xuất hiện trong danh sách
    await expect(page.locator(`h3:has-text("${taskTitle}")`)).toBeVisible();
    
    // Kiểm tra form bị reset và thu gọn
    await expect(page.locator('input[name="title"]')).toHaveValue('');
  });

  test('E2E_TODO_02: Tạo công việc khi tiêu đề rỗng (Zod Validation)', async ({ page }) => {
    await page.locator('input[name="title"]').click();
    await page.locator('input[name="title"]').fill('   '); // Toàn khoảng trắng
    
    await page.getByRole('button', { name: /thêm việc/i }).click();

    // Chờ validation error từ Zod/React-Hook-Form
    await expect(page.locator('.text-red-500').first()).toBeVisible();
  });

  test('E2E_TODO_03: Chỉnh sửa tên công việc', async ({ page }) => {
    // Tạo 1 task trước để sửa
    const initialTitle = `Task to edit ${Date.now()}`;
    await page.locator('input[name="title"]').click();
    await page.locator('input[name="title"]').fill(initialTitle);
    await page.getByRole('button', { name: /thêm việc/i }).click();

    // Tìm item đó và click nút Edit
    const taskItem = page.locator('.group').filter({ hasText: initialTitle }).first();
    await taskItem.locator('button[title="Sửa công việc"]').click();

    // Điền tên mới
    const updatedTitle = `${initialTitle} (Updated)`;
    await page.locator('input[placeholder="Tên công việc..."]').fill(updatedTitle);
    
    // Đợi API Update hoàn tất
    const updatePromise = page.waitForResponse(res => res.url().includes('/todos/') && res.request().method() === 'PUT');
    await page.getByRole('button', { name: /lưu/i }).click();
    await updatePromise;

    // Xác nhận đã đổi tên thành công trên giao diện
    await expect(page.locator(`h3:has-text("${updatedTitle}")`)).toBeVisible();
  });

  test('E2E_TODO_04: Click hoàn thành công việc và Lọc danh sách', async ({ page }) => {
    // Tạo task để test lọc
    const filterTaskTitle = `Filter Task ${Date.now()}`;
    await page.locator('input[name="title"]').click();
    await page.locator('input[name="title"]').fill(filterTaskTitle);
    await page.getByRole('button', { name: /thêm việc/i }).click();
    
    const taskItem = page.locator('.group').filter({ hasText: filterTaskTitle }).first();
    await expect(taskItem).toBeVisible();

    // Bấm tab Đã xong -> Sẽ không thấy task này
    await page.getByRole('button', { name: 'Đã xong' }).click();
    await expect(page.locator(`h3:has-text("${filterTaskTitle}")`)).not.toBeVisible();

    // Bấm tab Đang làm -> Sẽ thấy task này
    await page.getByRole('button', { name: 'Đang làm' }).click();
    await expect(page.locator(`h3:has-text("${filterTaskTitle}")`)).toBeVisible();

    // Chuyển sang tab Tất cả và Toggle hoàn thành task
    await page.getByRole('button', { name: 'Tất cả' }).click();
    
    // Đợi API update status
    const togglePromise = page.waitForResponse(res => res.url().includes('/todos/') && res.request().method() === 'PUT');
    await taskItem.locator('button').first().click();
    const toggleResponse = await togglePromise;
    expect(toggleResponse.status()).toBe(200);

    // Bấm tab Đang làm -> Không còn thấy nữa
    await page.getByRole('button', { name: 'Đang làm' }).click();
    await expect(page.locator(`h3:has-text("${filterTaskTitle}")`)).not.toBeVisible();

    // Bấm tab Đã xong -> Lại thấy task này
    await page.getByRole('button', { name: 'Đã xong' }).click();
    await expect(page.locator(`h3:has-text("${filterTaskTitle}")`)).toBeVisible();
  });

  test('E2E_TODO_05: Xóa công việc', async ({ page }) => {
    // Tạo task để xóa
    const deleteTaskTitle = `Delete Task ${Date.now()}`;
    await page.locator('input[name="title"]').click();
    await page.locator('input[name="title"]').fill(deleteTaskTitle);
    await page.getByRole('button', { name: /thêm việc/i }).click();
    
    const taskItem = page.locator('.group').filter({ hasText: deleteTaskTitle }).first();
    
    // Click nút thùng rác
    await taskItem.locator('button[title="Xóa công việc"]').click();

    // Sẽ biến mất khỏi danh sách
    await expect(page.locator(`h3:has-text("${deleteTaskTitle}")`)).not.toBeVisible();
  });

});
