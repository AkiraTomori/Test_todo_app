const prisma = require('../config/prisma');

const todoModel = {
  findTodosByUserId: async (userId, limit, offset, status) => {
    const whereClause = { user_id: userId };
    if (status !== undefined) {
      whereClause.is_completed = status;
    }

    return await prisma.todo.findMany({
      where: whereClause,
      orderBy: { created_at: 'desc' },
      take: limit,
      skip: offset,
    });
  },

  countTodosByUserId: async (userId, status) => {
    const whereClause = { user_id: userId };
    if (status !== undefined) {
      whereClause.is_completed = status;
    }

    return await prisma.todo.count({
      where: whereClause,
    });
  },

  findTodoById: async (id) => {
    return await prisma.todo.findUnique({
      where: { id },
    });
  },

  createTodo: async (userId, title, description) => {
    return await prisma.todo.create({
      data: {
        user_id: userId,
        title,
        description,
      },
    });
  },

  updateTodo: async (id, title, description, is_completed) => {
    return await prisma.todo.update({
      where: { id },
      data: {
        title,
        description,
        is_completed,
      },
    });
  },

  deleteTodo: async (id) => {
    return await prisma.todo.delete({
      where: { id },
    });
  }
};

module.exports = todoModel;
