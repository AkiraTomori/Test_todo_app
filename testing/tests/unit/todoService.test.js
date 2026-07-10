const todoService = require('../../../backend/src/services/todoService');
const todoModel = require('../../../backend/src/models/todoModel');

// Mock phụ thuộc Model
jest.mock('../../../backend/src/models/todoModel');

describe('todoService.createTodo (White-box Testing)', () => {
  const mockUserId = 1;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Path 1: Ném lỗi 400 nếu title rỗng hoặc toàn khoảng trắng', async () => {
    await expect(todoService.createTodo(mockUserId, '', 'desc')).rejects.toMatchObject({
      message: 'Title is required',
      statusCode: 400
    });

    await expect(todoService.createTodo(mockUserId, '   ', 'desc')).rejects.toMatchObject({
      message: 'Title is required',
      statusCode: 400
    });

    expect(todoModel.createTodo).not.toHaveBeenCalled();
  });

  test('Path 2: Tạo thành công khi title hợp lệ và không có description', async () => {
    const mockTodo = { id: 10, title: 'Valid Title', description: null };
    todoModel.createTodo.mockResolvedValue(mockTodo);

    const result = await todoService.createTodo(mockUserId, 'Valid Title', null);

    expect(result).toEqual(mockTodo);
    expect(todoModel.createTodo).toHaveBeenCalledWith(mockUserId, 'Valid Title', null);
  });

  test('Path 3: Tạo thành công khi title và description hợp lệ (Có tự động Trim)', async () => {
    const mockTodo = { id: 11, title: 'Trimmed Title', description: 'Trimmed Desc' };
    todoModel.createTodo.mockResolvedValue(mockTodo);

    const result = await todoService.createTodo(mockUserId, '  Trimmed Title  ', '  Trimmed Desc  ');

    expect(result).toEqual(mockTodo);
    // Xác minh hàm model nhận được chuỗi đã qua hàm .trim()
    expect(todoModel.createTodo).toHaveBeenCalledWith(mockUserId, 'Trimmed Title', 'Trimmed Desc');
  });
});

describe('todoService.updateTodo (White-box Testing)', () => {
  const mockUserId = 1;
  const mockTodoId = 100;
  const mockTodo = {
    id: 100,
    user_id: 1,
    title: 'Old Title',
    description: 'Old Description',
    is_completed: false
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Path 1: Ném lỗi 404 khi Todo không tồn tại', async () => {
    todoModel.findTodoById.mockResolvedValue(null);

    await expect(todoService.updateTodo(mockUserId, mockTodoId, 'New', 'Desc', true)).rejects.toMatchObject({
      message: 'Todo not found',
      statusCode: 404
    });

    expect(todoModel.updateTodo).not.toHaveBeenCalled();
  });

  test('Path 2: Ném lỗi 403 khi User update Todo của người khác', async () => {
    // Trả về todo của user_id = 999
    todoModel.findTodoById.mockResolvedValue({ ...mockTodo, user_id: 999 });

    await expect(todoService.updateTodo(mockUserId, mockTodoId, 'New', 'Desc', true)).rejects.toMatchObject({
      message: 'Forbidden: You are not allowed to update this todo',
      statusCode: 403
    });

    expect(todoModel.updateTodo).not.toHaveBeenCalled();
  });

  test('Path 3: Ném lỗi 400 khi Title truyền lên là toàn khoảng trắng', async () => {
    todoModel.findTodoById.mockResolvedValue(mockTodo);

    await expect(todoService.updateTodo(mockUserId, mockTodoId, '   ', 'Desc', true)).rejects.toMatchObject({
      message: 'Title cannot be empty',
      statusCode: 400
    });

    expect(todoModel.updateTodo).not.toHaveBeenCalled();
  });

  test('Path 4: Cập nhật thành công toàn phần (Có tự động Trim)', async () => {
    todoModel.findTodoById.mockResolvedValue(mockTodo);
    const mockUpdated = { ...mockTodo, title: 'New', description: 'Desc', is_completed: true };
    todoModel.updateTodo.mockResolvedValue(mockUpdated);

    const result = await todoService.updateTodo(mockUserId, mockTodoId, '  New  ', '  Desc  ', true);

    expect(result).toEqual(mockUpdated);
    expect(todoModel.updateTodo).toHaveBeenCalledWith(mockTodoId, 'New', 'Desc', true);
  });

  test('Path 5: Cập nhật bán phần (Partial Update - Logic Fallback)', async () => {
    todoModel.findTodoById.mockResolvedValue(mockTodo);
    todoModel.updateTodo.mockResolvedValue(mockTodo);

    // Không truyền title, description, is_completed (tương đương undefined)
    const result = await todoService.updateTodo(mockUserId, mockTodoId, undefined, undefined, undefined);

    expect(result).toEqual(mockTodo);
    // Hàm model sẽ nhận lại đúng các thông tin cũ từ `mockTodo`
    expect(todoModel.updateTodo).toHaveBeenCalledWith(mockTodoId, 'Old Title', 'Old Description', false);
  });

  test('Path 6: Xử lý an toàn khi truyền null vào Description', async () => {
    todoModel.findTodoById.mockResolvedValue(mockTodo);
    const mockUpdated = { ...mockTodo, description: null };
    todoModel.updateTodo.mockResolvedValue(mockUpdated);

    // Truyền explicit null
    const result = await todoService.updateTodo(mockUserId, mockTodoId, undefined, null, undefined);

    expect(result).toEqual(mockUpdated);
    // Đảm bảo null được truyền đi đúng cách mà không bị crash
    expect(todoModel.updateTodo).toHaveBeenCalledWith(mockTodoId, 'Old Title', null, false);
  });
});
