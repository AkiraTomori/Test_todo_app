const authService = require('../../../backend/src/services/authService');
const userModel = require('../../../backend/src/models/userModel');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock các phụ thuộc
jest.mock('../../../backend/src/models/userModel');
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authService.login (White-box Testing)', () => {
  const mockUsername = 'testuser';
  const mockPassword = 'password123';
  const mockUser = {
    id: 1,
    username: 'testuser',
    password_hash: 'hashed_password123'
  };

  beforeEach(() => {
    // Reset toàn bộ mock trước mỗi test case
    jest.clearAllMocks();
    process.env.JWT_SECRET = 'test_secret';
  });

  test('Path 1: Ném lỗi 401 khi user không tồn tại', async () => {
    // Giả lập model không tìm thấy user
    userModel.findByUsername.mockResolvedValue(null);

    // Kì vọng ném lỗi
    await expect(authService.login(mockUsername, mockPassword)).rejects.toMatchObject({
      message: 'Invalid credentials',
      status: 401
    });

    // Xác minh hàm phụ thuộc được gọi đúng
    expect(userModel.findByUsername).toHaveBeenCalledWith(mockUsername);
    expect(bcrypt.compare).not.toHaveBeenCalled();
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  test('Path 2: Ném lỗi 401 khi sai mật khẩu', async () => {
    // Giả lập model tìm thấy user
    userModel.findByUsername.mockResolvedValue(mockUser);
    // Giả lập bcrypt so sánh sai
    bcrypt.compare.mockResolvedValue(false);

    await expect(authService.login(mockUsername, mockPassword)).rejects.toMatchObject({
      message: 'Invalid credentials',
      status: 401
    });

    expect(userModel.findByUsername).toHaveBeenCalledWith(mockUsername);
    expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockUser.password_hash);
    expect(jwt.sign).not.toHaveBeenCalled();
  });

  test('Path 3: Đăng nhập thành công và trả về token', async () => {
    userModel.findByUsername.mockResolvedValue(mockUser);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue('mocked_token');

    const result = await authService.login(mockUsername, mockPassword);

    // Xác minh kết quả trả về
    expect(result).toEqual({
      token: 'mocked_token',
      user: {
        id: mockUser.id,
        username: mockUser.username
      }
    });

    // Xác minh hàm phụ thuộc
    expect(userModel.findByUsername).toHaveBeenCalledWith(mockUsername);
    expect(bcrypt.compare).toHaveBeenCalledWith(mockPassword, mockUser.password_hash);
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: mockUser.id, username: mockUser.username },
      'test_secret',
      { expiresIn: '1d' }
    );
  });
});
