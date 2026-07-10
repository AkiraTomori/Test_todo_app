const { test, expect } = require('@playwright/test');

test.describe('Scenario Testing - Life histories & Abuse', () => {

  // Chuẩn bị trước mỗi bài test: Đăng nhập với tư cách Guest
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.getByTestId('login-username-input').fill('guest');
    await page.getByTestId('login-password-input').fill('guest123');
    await page.getByTestId('login-submit-btn').click();
    await expect(page).toHaveURL('/todos');
  });

  test('Kịch bản 1 (Life histories): Vòng đời của nhiệm vụ "Nộp báo cáo"', async ({ page }) => {
    test.slow(); // Đánh dấu kịch bản này chạy chậm/dài

    const taskTitle = 'Nộp báo cáo tài chính tháng 7';
    const taskTitleUpdated = 'Nộp báo cáo tài chính tháng 7 (Nhớ đính kèm file Excel)';

    // Bước 1: [Sinh ra] Sáng thứ Hai tạo Todo
    await page.getByTestId('todo-title-input').click(); // Click để mở rộng form
    await page.getByTestId('todo-title-input').fill(taskTitle);
    const addPromise = page.waitForResponse(res => res.url().includes('/api/todos') && res.request().method() === 'POST');
    await page.getByTestId('todo-submit-btn').click();
    await addPromise;

    // Kiểm tra đã xuất hiện
    const taskItem = page.getByTestId('todo-item').filter({ hasText: taskTitle }).first();
    await expect(taskItem).toBeVisible();

    // Bước 2: [Sửa đổi] Chiều thứ Hai update nội dung
    await taskItem.getByTestId('todo-edit-btn').click(); // Bấm nút Edit (biểu tượng bút)
    const editInput = page.getByTestId('todo-edit-title-input');
    await editInput.fill(taskTitleUpdated);
    const editPromise = page.waitForResponse(res => res.url().includes('/api/todos') && res.request().method() === 'PUT');
    await page.getByTestId('todo-edit-save-btn').click(); // Bấm nút Save
    await editPromise;

    // Bước 3: [Tương tác] Thứ Tư làm xong, đánh dấu hoàn thành
    const updatedTaskItem = page.getByTestId('todo-item').filter({ hasText: taskTitleUpdated }).first();
    const completePromise = page.waitForResponse(res => res.url().includes('/api/todos') && res.request().method() === 'PUT');
    await updatedTaskItem.getByTestId('todo-toggle-btn').click(); // Bấm icon Check
    await completePromise;

    // Kiểm tra chữ bị gạch ngang
    await expect(updatedTaskItem.getByTestId('todo-item-title')).toHaveClass(/line-through/);
    await page.getByRole('button', { name: 'Đã xong' }).click();
    await expect(updatedTaskItem).toBeVisible();

    // Bước 4: [Nhầm lẫn] Reopen task (Bỏ đánh dấu)
    const reopenPromise = page.waitForResponse(res => res.url().includes('/api/todos') && res.request().method() === 'PUT');
    await updatedTaskItem.getByTestId('todo-toggle-btn').click(); 
    await reopenPromise;

    // Kiểm tra quay về "Đang làm"
    await page.getByRole('button', { name: 'Đang làm' }).click();
    await expect(updatedTaskItem).toBeVisible();

    // Bước 5: [Kết thúc] Xóa task vì cuối cùng sếp bảo không cần báo cáo nữa
    const deletePromise = page.waitForResponse(res => res.url().includes('/api/todos') && res.request().method() === 'DELETE');
    await updatedTaskItem.getByTestId('todo-delete-btn').click();
    await page.getByRole('button', { name: 'Đồng ý xóa' }).click();
    await deletePromise;

    // Xác nhận bốc hơi
    await expect(updatedTaskItem).not.toBeVisible();
  });


  test('Kịch bản 2 (Abuse): Kẻ phá hoại cố tình hack XSS và làm vỡ UI', async ({ page }) => {
    // 1. Tấn công XSS (Mã độc JavaScript/HTML)
    const xssPayload = `<img src="x" onerror="alert('HACKED!')" /> <script>alert(1)</script>`;
    await page.getByTestId('todo-title-input').click();
    await page.getByTestId('todo-title-input').fill(xssPayload);
    await page.getByTestId('todo-submit-btn').click();

    // Nếu React chống XSS tốt, nó sẽ render thành văn bản thuần túy, không bật bảng Alert.
    // Xác minh văn bản y hệt hiển thị trên màn hình
    const xssItem = page.getByTestId('todo-item').filter({ hasText: xssPayload }).first();
    await expect(xssItem).toBeVisible();

    // 2. Tấn công tràn viền UI (Nội dung quá dài)
    const longText = 'A'.repeat(200); // 200 ký tự A liên tiếp (giới hạn tối đa của Yup validation)
    await page.getByTestId('todo-title-input').click();
    await page.getByTestId('todo-title-input').fill(longText);
    const longPromise = page.waitForResponse(res => res.url().includes('/api/todos') && res.request().method() === 'POST');
    await page.getByTestId('todo-submit-btn').click();
    await longPromise;

    // Xác minh thẻ chứa chữ không bị tràn ra ngoài màn hình (Chiều rộng phải nhỏ hơn màn hình)
    const longTextItem = page.getByTestId('todo-item').filter({ hasText: longText }).first();
    await expect(longTextItem).toBeVisible();
    
    const boundingBox = await longTextItem.boundingBox();
    const viewportSize = page.viewportSize();
    
    // Đảm bảo chiều rộng của item không lớn hơn chiều rộng màn hình (Không gây thanh cuộn ngang)
    expect(boundingBox.width).toBeLessThanOrEqual(viewportSize.width);

    // Dọn dẹp: Xóa cả 2 task rác này
    for (let i = 0; i < 2; i++) {
        const deletePromise = page.waitForResponse(res => res.url().includes('/api/todos') && res.request().method() === 'DELETE');
        await page.getByTestId('todo-item').first().getByTestId('todo-delete-btn').click();
        await page.getByRole('button', { name: 'Đồng ý xóa' }).click();
        await deletePromise;
    }
  });
});
