const prisma = require('../config/prisma');

const userModel = {
  findByUsername: async (username) => {
    return await prisma.user.findUnique({
      where: { username },
    });
  },
  
  findById: async (id) => {
    return await prisma.user.findUnique({
      where: { id },
    });
  },

  createUser: async (username, password_hash) => {
    return await prisma.user.create({
      data: {
        username,
        password_hash,
      },
      select: {
        id: true,
        username: true,
        created_at: true,
        updated_at: true,
      },
    });
  }
};

module.exports = userModel;
