// Import bcrypt for password hashing
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto");

// Import User model
const { User } = require('../models/index')

// Import email functions
const { sendEmail, verificationEmail } = require("../config/email");

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
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Step 5 — Save user to database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: false,
      verificationToken,
    });

    const verificationLink = `${process.env.BACKEND_URL}/api/auth/verify-email/${verificationToken}`;

    // Step 6 — Send welcome email
   await sendEmail({
     to: user.email,
     subject: "Verify Your Email - CTMS",
     html: verificationEmail(user.name, verificationLink),
   });
    // Step 7 — Send response (never send password back!)
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

// ========== LOGIN ==========
const login = async (req, res) => {
  try {
    // Step 1 — Get email and password
    const { email, password } = req.body

    // Step 2 — Validate fields
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

    // Step 3 — Find user by email
    const user = await User.findOne({
      where: { email }
    })

    // Step 4 — If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password!'
      })
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Step 5 — Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,        // what user typed
      user.password    // hashed password in database
    )

    // Step 6 — If password wrong
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password!'
      })
    }

    // Step 7 — Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE
      }
    )

    // Step 8 — Send token to user
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token: token,
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



// ========== GET PROFILE ==========
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'isActive', 'createdAt']
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      })
    }

    res.status(200).json({
      success: true,
      data: user
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== UPDATE PROFILE ==========
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required!'
      })
    }

    const user = await User.findByPk(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      })
    }

    await user.update({ name })

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
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
// ========== VERIFY EMAIL ==========
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        verificationToken: token
      }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid verification token!"
      });
    }

    await user.update({
      isVerified: true,
      verificationToken: null
    });

    res.status(200).json({
      success: true,
      message: "Email verified successfully!"
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// ========== CHANGE PASSWORD ==========
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required!'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters!'
      })
    }

    const user = await User.findByPk(req.user.id)

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect!'
      })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await user.update({ password: hashedPassword })

    res.status(200).json({
      success: true,
      message: 'Password changed successfully!'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  getProfile,
  updateProfile,
  changePassword,
};