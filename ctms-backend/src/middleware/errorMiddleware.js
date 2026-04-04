// ========== GLOBAL ERROR HANDLER ==========
// This catches ALL errors from entire app
// It has 4 parameters — that is how Express knows it is error handler

const errorHandler = (err, req, res, next) => {

  // Step 1 — Print error in terminal for debugging
  console.error('❌ ERROR:', err.message)
  console.error('📍 WHERE:', err.stack)

  // Step 2 — Get status code
  // Use error's own status code OR default to 500
  const statusCode = err.statusCode || err.status || 500

  // Step 3 — Get error message
  // Use error's own message OR default message
  const message = err.message || 'Internal Server Error'

  // Step 4 — Send error response to user
  res.status(statusCode).json({
    success: false,
    message: message,
    // Show full error details ONLY in development
    // In production — hide error details from user!
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  })
}

module.exports = errorHandler