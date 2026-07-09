const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const authController = {
  register: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: true, message: 'Username and password are required' });
      }

      const existingUser = await userModel.findByUsername(username);
      if (existingUser) {
        return res.status(409).json({ error: true, message: 'Username already exists' });
      }

      const hash = await bcrypt.hash(password, 10);
      const newUser = await userModel.createUser(username, hash);

      res.status(201).json({ success: true, data: newUser });
    } catch (err) {
      next(err);
    }
  },

  login: async (req, res, next) => {
    try {
      const { username, password } = req.body;
      if (!username || !password) {
        return res.status(400).json({ error: true, message: 'Username and password are required' });
      }

      const user = await userModel.findByUsername(username);
      if (!user) {
        return res.status(401).json({ error: true, message: 'Invalid credentials' });
      }

      const isMatch = await bcrypt.compare(password, user.password_hash);
      if (!isMatch) {
        return res.status(401).json({ error: true, message: 'Invalid credentials' });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username },
        process.env.JWT_SECRET,
        { expiresIn: '1d' }
      );

      res.json({ success: true, token });
    } catch (err) {
      next(err);
    }
  }
};

module.exports = authController;
