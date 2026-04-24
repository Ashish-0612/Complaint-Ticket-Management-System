const { body, validationResult } = require('express-validator')

// ========== HANDLE VALIDATION ERRORS ==========
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed!',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    })
  }

  next()
}

// ========== REGISTER VALIDATION ==========
const validateRegister = [
  body('name')
    .notEmpty()
    .withMessage('Name is required!')
    .isLength({ min: 3 })
    .withMessage('Name must be at least 3 characters!'),

  body('email')
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Please provide a valid email!'),

  body('password')
    .notEmpty()
    .withMessage('Password is required!')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters!'),

  handleValidationErrors
]

// ========== LOGIN VALIDATION ==========
const validateLogin = [
  body('email')
    .notEmpty()
    .withMessage('Email is required!')
    .isEmail()
    .withMessage('Please provide a valid email!'),

  body('password')
    .notEmpty()
    .withMessage('Password is required!'),

  handleValidationErrors
]

// ========== CREATE TICKET VALIDATION ==========
const validateTicket = [
  body('title')
    .notEmpty()
    .withMessage('Title is required!')
    .isLength({ min: 5 })
    .withMessage('Title must be at least 5 characters!'),

  body('description')
    .notEmpty()
    .withMessage('Description is required!')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters!'),

  body('priority')
    .optional()
    .isIn(['critical', 'high', 'medium', 'low'])
    .withMessage('Priority must be critical, high, medium or low!'),

  body('departmentId')
    .notEmpty()
    .withMessage('Department is required!')
    .isNumeric()
    .withMessage('Department ID must be a number!'),

  handleValidationErrors
]

module.exports = {
  validateRegister,
  validateLogin,
  validateTicket
}