const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middlewares/authMiddleware');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { createTodoSchema, updateTodoSchema } = require('../validations/todoValidation');

// Zero-trust: All todo routes require authentication
router.use(authMiddleware);

router.get('/', todoController.getTodos);
router.post('/', validateMiddleware(createTodoSchema), todoController.createTodo);
router.put('/:id', validateMiddleware(updateTodoSchema), todoController.updateTodo);
router.delete('/:id', todoController.deleteTodo);

module.exports = router;
