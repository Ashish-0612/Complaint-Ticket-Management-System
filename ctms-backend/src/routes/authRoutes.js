const express = require('express')
const router = express.Router()

// Import auth controller
const { register , login} = require('../controllers/authController')

// ========== AUTH ROUTES ==========

// POST /api/auth/register — create new account
router.post('/register', register)

router.post('/login', login)

module.exports = router;