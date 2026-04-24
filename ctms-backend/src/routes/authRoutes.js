const express = require('express')
const router = express.Router()

// Import auth controller
const { register , login} = require('../controllers/authController')
const { validateRegister, validateLogin } = require('../middleware/validationMiddleware')

// ========== AUTH ROUTES ==========

// POST /api/auth/register — create new account
router.post('/register',validateRegister, register)

router.post('/login',validateLogin , login)

module.exports = router;