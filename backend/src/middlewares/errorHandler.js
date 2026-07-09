const errorHandler = (err, req, res, next) => {
  console.error(err.stack);
  
  // Custom error from our services usually have a statusCode
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  res.status(statusCode).json({
    error: true,
    message: message,
  });
};

module.exports = errorHandler;
