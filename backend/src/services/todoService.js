const todoModel = require('../models/todoModel');

class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

const todoService = {
  getTodos: async (userId, page = 1, limit = 10, status) => {
    const offset = (page - 1) * limit;
    
    let isCompleted;
    if (status === 'completed') isCompleted = true;
    if (status === 'pending') isCompleted = false;

    const todos = await todoModel.findTodosByUserId(userId, limit, offset, isCompleted);
    const totalItems = await todoModel.countTodosByUserId(userId, isCompleted);

    return {
      todos,
      pagination: {
        totalItems,
        currentPage: Number(page),
        totalPages: Math.ceil(totalItems / limit),
        limit: Number(limit)
      }
    };
  },

  createTodo: async (userId, title, description) => {
    if (!title || title.trim() === '') {
      throw new CustomError('Title is required', 400);
    }
    return await todoModel.createTodo(userId, title.trim(), description ? description.trim() : null);
  },

  updateTodo: async (userId, todoId, title, description, is_completed) => {
    const todo = await todoModel.findTodoById(todoId);
    
    if (!todo) {
      throw new CustomError('Todo not found', 404);
    }

    // Zero-trust: Check authorization
    if (todo.user_id !== userId) {
      throw new CustomError('Forbidden: You are not allowed to update this todo', 403);
    }

    if (title && title.trim() === '') {
      throw new CustomError('Title cannot be empty', 400);
    }

    const updatedTitle = title !== undefined ? title.trim() : todo.title;
    const updatedDesc = description !== undefined ? description.trim() : todo.description;
    const updatedStatus = is_completed !== undefined ? is_completed : todo.is_completed;

    return await todoModel.updateTodo(todoId, updatedTitle, updatedDesc, updatedStatus);
  },

  deleteTodo: async (userId, todoId) => {
    const todo = await todoModel.findTodoById(todoId);
    
    if (!todo) {
      throw new CustomError('Todo not found', 404);
    }

    // Zero-trust: Check authorization
    if (todo.user_id !== userId) {
      throw new CustomError('Forbidden: You are not allowed to delete this todo', 403);
    }

    return await todoModel.deleteTodo(todoId);
  }
};

module.exports = todoService;
