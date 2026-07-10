const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');

const authService = {
  register: async (username, password) => {
    const existingUser = await userModel.findByUsername(username);
    if (existingUser) {
      const error = new Error('Username already exists');
      error.status = 409;
      throw error;
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await userModel.createUser(username, hash);
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, user: newUser };
  },

  login: async (username, password) => {
    const user = await userModel.findByUsername(username);
    if (!user) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      const error = new Error('Invalid credentials');
      error.status = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    return { token, user: { id: user.id, username: user.username } };
  }
};

module.exports = authService;
