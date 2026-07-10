const { test, expect } = require('@playwright/test');

test.describe('Todo CRUD & Filtering Flow', () => {

  // Before each test, login as admin to get to /todos
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-username-input').fill('admin');
    await page.getByTestId('login-password-input').fill('admin123');
    await page.getByTestId('login-submit-btn').click();
    await expect(page).toHaveURL(/\/todos/);
  });

  test('E2E_TODO_01: Tạo công việc mới hợp lệ', async ({ page }) => {
    const taskTitle = `New Task ${Date.now()}`;
    
    // Focus vào input để mở rộng form
    await page.getByTestId('todo-title-input').click();
    await page.getByTestId('todo-title-input').fill(taskTitle);
    await page.getByTestId('todo-desc-input').fill('Task description');
    
    await page.getByTestId('todo-submit-btn').click();

    // Xác nhận task mới xuất hiện trong danh sách
    await expect(page.getByTestId('todo-item-title').filter({ hasText: taskTitle })).toBeVisible();
    
    // Kiểm tra form bị reset và thu gọn
    await expect(page.getByTestId('todo-title-input')).toHaveValue('');
  });

  test('E2E_TODO_02: Tạo công việc khi tiêu đề rỗng (Zod Validation)', async ({ page }) => {
    await page.getByTestId('todo-title-input').click();
    await page.getByTestId('todo-title-input').fill('   '); // Toàn khoảng trắng
    
    await page.getByTestId('todo-submit-btn').click();

    // Chờ validation error từ Zod/React-Hook-Form
    await expect(page.locator('.text-red-500').first()).toBeVisible();
  });

  test('E2E_TODO_03: Chỉnh sửa tên công việc', async ({ page }) => {
    // Tạo 1 task trước để sửa
    const initialTitle = `Task to edit ${Date.now()}`;
    await page.getByTestId('todo-title-input').click();
    await page.getByTestId('todo-title-input').fill(initialTitle);
    await page.getByTestId('todo-submit-btn').click();

    // Tìm item đó và click nút Edit
    const taskItem = page.getByTestId('todo-item').filter({ hasText: initialTitle }).first();
    await taskItem.getByTestId('todo-edit-btn').click();

    // Điền tên mới
    const updatedTitle = `${initialTitle} (Updated)`;
    await page.getByTestId('todo-edit-title-input').fill(updatedTitle);
    
    // Đợi API Update hoàn tất
    const updatePromise = page.waitForResponse(res => res.url().includes('/api/todos') && res.request().method() === 'PUT');
    await page.getByTestId('todo-edit-save-btn').click();
    await updatePromise;

    // Xác nhận đã đổi tên thành công trên giao diện
    await expect(page.getByTestId('todo-item-title').filter({ hasText: updatedTitle })).toBeVisible();
  });

  test('E2E_TODO_04: Click hoàn thành công việc và Lọc danh sách', async ({ page }) => {
    // Tạo task để test lọc
    const filterTaskTitle = `Filter Task ${Date.now()}`;
    await page.getByTestId('todo-title-input').click();
    await page.getByTestId('todo-title-input').fill(filterTaskTitle);
    await page.getByTestId('todo-submit-btn').click();
    
    const taskItem = page.getByTestId('todo-item').filter({ hasText: filterTaskTitle }).first();
    await expect(taskItem).toBeVisible();

    // Bấm tab Đã xong -> Sẽ không thấy task này
    await page.getByTestId('filter-completed-btn').click();
    await expect(page.getByTestId('todo-item-title').filter({ hasText: filterTaskTitle })).not.toBeVisible();

    // Bấm tab Đang làm -> Sẽ thấy task này
    await page.getByTestId('filter-active-btn').click();
    await expect(page.getByTestId('todo-item-title').filter({ hasText: filterTaskTitle })).toBeVisible();

    // Chuyển sang tab Tất cả và Toggle hoàn thành task
    await page.getByTestId('filter-all-btn').click();
    
    // Đợi API update status
    const togglePromise = page.waitForResponse(res => res.url().includes('/todos/') && res.request().method() === 'PUT');
    await taskItem.getByTestId('todo-toggle-btn').click();
    const toggleResponse = await togglePromise;
    expect(toggleResponse.status()).toBe(200);

    // Bấm tab Đang làm -> Không còn thấy nữa
    await page.getByTestId('filter-active-btn').click();
    await expect(page.getByTestId('todo-item-title').filter({ hasText: filterTaskTitle })).not.toBeVisible();

    // Bấm tab Đã xong -> Lại thấy task này
    await page.getByTestId('filter-completed-btn').click();
    await expect(page.getByTestId('todo-item-title').filter({ hasText: filterTaskTitle })).toBeVisible();
  });

  test('E2E_TODO_05: Xóa công việc', async ({ page }) => {
    // Tạo task để xóa
    const deleteTaskTitle = `Delete Task ${Date.now()}`;
    await page.getByTestId('todo-title-input').click();
    await page.getByTestId('todo-title-input').fill(deleteTaskTitle);
    await page.getByTestId('todo-submit-btn').click();
    
    const taskItem = page.getByTestId('todo-item').filter({ hasText: deleteTaskTitle }).first();
    
    // Click nút thùng rác
    await taskItem.getByTestId('todo-delete-btn').click();

    // Sẽ biến mất khỏi danh sách
    await expect(page.getByTestId('todo-item-title').filter({ hasText: deleteTaskTitle })).not.toBeVisible();
  });

});
