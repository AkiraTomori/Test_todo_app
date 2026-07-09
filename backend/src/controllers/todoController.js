const todoService = require('../services/todoService');

const todoController = {
  getTodos: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { page, limit, status } = req.query;
      
      const result = await todoService.getTodos(userId, page, limit, status);
      res.json({
        success: true,
        data: result.todos,
        pagination: result.pagination
      });
    } catch (error) {
      next(error);
    }
  },

  createTodo: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const { title, description } = req.body;
      
      if (!title) {
        return res.status(400).json({ error: true, message: "Title is required" });
      }

      const newTodo = await todoService.createTodo(userId, title, description);
      res.status(201).json({
        success: true,
        data: newTodo
      });
    } catch (error) {
      next(error);
    }
  },

  updateTodo: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const todoId = parseInt(req.params.id, 10);
      const { title, description, is_completed } = req.body;
      
      if (isNaN(todoId)) {
        return res.status(400).json({ error: true, message: "Invalid todo ID" });
      }

      const updatedTodo = await todoService.updateTodo(userId, todoId, title, description, is_completed);
      res.json({
        success: true,
        data: updatedTodo
      });
    } catch (error) {
      next(error);
    }
  },

  deleteTodo: async (req, res, next) => {
    try {
      const userId = req.user.id;
      const todoId = parseInt(req.params.id, 10);
      
      if (isNaN(todoId)) {
        return res.status(400).json({ error: true, message: "Invalid todo ID" });
      }

      const deletedTodo = await todoService.deleteTodo(userId, todoId);
      res.json({
        success: true,
        message: "Todo deleted successfully",
        data: deletedTodo
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = todoController;
