const errorHandler = (err, req, res, next) => {
    console.error(err); // Log error ke console
  
    const statusCode = err.statusCode || 500;
    const message = err.message || "Terjadi kesalahan pada server";
  
    return res.status(statusCode).json({
      success: false,
      statusCode,
      message,
    });
  };
  
  // Middleware untuk menangani error tertentu
  const errorResponse = (statusCode, message) => {
    const error = new Error(message);
    error.statusCode = statusCode;
    return error;
  };
  
  module.exports = { errorHandler, errorResponse };
  