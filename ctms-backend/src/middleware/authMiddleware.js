// Import jwt
const jwt = require('jsonwebtoken')

// Import User model
const { User } = require('../models/index')

// ========== AUTH MIDDLEWARE ==========
const protect = async (req, res, next) => {
  try {
    let token

    // Step 1 — Check if Authorization header exists
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      // Step 2 — Extract token from header
      // "Bearer eyJhbGci..." → split by space → take [1]
      token = req.headers.authorization.split(' ')[1]
    }

    // Step 3 — If no token found
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized! Please login first.'
      })
    }

    // Step 4 — Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    // decoded = { id: 1, email: 'ashu@gmail.com', role: 'admin' }

    // Step 5 — Find user from database
    const user = await User.findByPk(decoded.id)

    // Step 6 — If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists!'
      })
    }

    // Step 7 — Attach user to request
    req.user = user

    // Step 8 — Move to next middleware or controller
    next()

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired! Please login again.'
    })
  }
}

module.exports = { protect }