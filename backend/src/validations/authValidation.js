const { z } = require('zod');

const authValidationSchema = z.object({
  body: z.object({
    username: z.string()
      .min(3, { message: "Tên đăng nhập ít nhất 3 ký tự" })
      .regex(/^[a-zA-Z0-9]+$/, { message: "Tên đăng nhập không chứa ký tự đặc biệt" }),
    password: z.string()
      .min(6, { message: "Mật khẩu ít nhất 6 ký tự" })
      .regex(/[0-9]/, { message: "Mật khẩu bắt buộc phải chứa ít nhất 1 số" })
  })
});

module.exports = { authValidationSchema };
