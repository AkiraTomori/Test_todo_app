const authService = require('../services/authService');

const authController = {
  register: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: true, message: 'Username and password are required' });
      }

      const { token, user } = await authService.register(username, password);
      res.status(201).json({ success: true, token, user });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ error: true, message: err.message });
      }
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: true, message: 'Username and password are required' });
      }

      const { token, user } = await authService.login(username, password);
      res.json({ success: true, token, user });
    } catch (err) {
      if (err.status) {
        return res.status(err.status).json({ error: true, message: err.message });
      }
      next(err);
    }
  }
};

module.exports = authController;
