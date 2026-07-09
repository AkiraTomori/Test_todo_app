const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const validateMiddleware = require('../middlewares/validateMiddleware');
const { authValidationSchema } = require('../validations/authValidation');

router.post('/register', validateMiddleware(authValidationSchema), authController.register);
router.post('/login', validateMiddleware(authValidationSchema), authController.login);

module.exports = router;
