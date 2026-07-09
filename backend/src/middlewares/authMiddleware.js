const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized: Missing or invalid token',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Dữ liệu payload của token (vd: { id: 1, username: 'admin' })
    next();
  } catch (err) {
    return res.status(401).json({
      error: true,
      message: 'Unauthorized: Token expired or invalid',
    });
  }
};

module.exports = authMiddleware;
