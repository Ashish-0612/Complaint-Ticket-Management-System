// Import bcrypt for password hashing
const bcrypt = require('bcryptjs')

// Import User model
const { User } = require('../models/index')

// ========== REGISTER ==========
const register = async (req, res) => {
  try {
    // Step 1 — Get data from request body
    const { name, email, password, role } = req.body

    // Step 2 — Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required!'
      })
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required!'
      })
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required!'
      })
    }

    // Step 3 — Check if email already exists
    const existingUser = await User.findOne({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered! Please login.'
      })
    }

    // Step 4 — Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    // Step 5 — Save user to database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,  // save hashed password!
      role: role || 'user'
    })

    // Step 6 — Send response (never send password back!)
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = { register }