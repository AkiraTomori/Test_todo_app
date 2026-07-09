const { z } = require('zod');

const createTodoSchema = z.object({
  body: z.object({
    title: z.string()
      .trim()
      .min(2, { message: "Tên công việc ít nhất 2 ký tự" })
      .max(200, { message: "Tên công việc không quá 200 ký tự" }),
    description: z.string().trim().max(500, { message: "Mô tả không quá 500 ký tự" }).optional().nullable()
  })
});

const updateTodoSchema = z.object({
  body: z.object({
    title: z.string()
      .trim()
      .min(2, { message: "Tên công việc ít nhất 2 ký tự" })
      .max(200, { message: "Tên công việc không quá 200 ký tự" })
      .optional(),
    description: z.string().trim().max(500, { message: "Mô tả không quá 500 ký tự" }).optional().nullable(),
    is_completed: z.boolean().optional()
  })
});

module.exports = { createTodoSchema, updateTodoSchema };
