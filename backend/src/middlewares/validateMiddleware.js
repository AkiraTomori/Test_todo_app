const { z } = require('zod');

const validateMiddleware = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({
          status: 'error',
          message: error.errors.map(err => err.message).join(', ')
        });
      }
      next(error);
    }
  };
};

module.exports = validateMiddleware;
