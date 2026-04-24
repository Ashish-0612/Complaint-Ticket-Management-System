// Step 1 — Load .env file variables first — always at top!
require('dotenv').config()

const helmet = require('helmet')
const rateLimit = require('express-rate-limit')

// ✅ CORRECT — import from models/index
const { User, Department, Category, Ticket, Comment, ActivityLog } = require('./src/models/index') 
const commentRoutes = require('./src/routes/commentRoutes') 


// Step 2 — Import express package
const express = require('express')

// Step 3 — Import cors package
const cors = require('cors')

// DB connection
const { connectDB } = require('./src/config/database')

// Step 3 — Import our files
const ticketRoutes = require('./src/routes/ticketRoutes')
const errorHandler = require('./src/middleware/errorMiddleware')
const authRoutes = require('./src/routes/authRoutes')
const departmentRoutes = require('./src/routes/departmentRoutes')
const categoryRoutes = require('./src/routes/categoryRoutes')


// Step 4 — Create express application
const app = express()

// ========== SECURITY ==========
// Helmet — adds security headers
app.use(helmet())

// ========== RATE LIMITING ==========
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    success: false,
    message: 'Too many requests! Please try again after 15 minutes.'
  }
})
app.use(limiter)

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    success: false,
    message: 'Too many login attempts! Please try again after 15 minutes.'
  }
})
app.use('/api/auth', authLimiter)


// ========== MIDDLEWARE ==========

// Allow React frontend to talk to this backend
app.use(cors())

// Allow reading JSON data from request body
app.use(express.json())

// Allow reading form data from request body
app.use(express.urlencoded({ extended: true }))

// ========== ROUTES ==========

// Home route — just to verify server is running
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CTMS API is running!',
    developer: 'Ashu'
  })
})

// Ticket routes
// All /api/tickets requests go to ticketRoutes file
app.use('/api/tickets', ticketRoutes)

// Auth routes
app.use('/api/auth', authRoutes)

// Department routes
app.use('/api/departments', departmentRoutes)

// Category routes
app.use('/api/categories', categoryRoutes)

// Comment routes — nested under tickets
app.use('/api/tickets/:ticketId/comments', commentRoutes)


// ========== 404 HANDLER ==========

// If no route matched — send 404
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.method} ${req.originalUrl}`
  })
})

// ========== ERROR HANDLER ==========

// Must be LAST — catches all errors from entire app
app.use(errorHandler)



// ========== START SERVER ==========

const PORT = process.env.PORT || 5000

app.listen(PORT, async () => {
  console.log(`✅ CTMS Server running on port ${PORT}`)
  console.log(`🌐 URL: http://localhost:${PORT}`)
  console.log(`📦 Environment: ${process.env.NODE_ENV}`)

  // Connect to database
  await connectDB()

  // Sync ALL models to database
  await User.sync({ force: false })
  console.log('✅ Users table synced!')

  await Department.sync({ force: false })
  console.log('✅ Departments table synced!')

  await Category.sync({ force: false })
  console.log('✅ Categories table synced!')

  await Ticket.sync({force: false })
  console.log('✅ Tickets table synced!')

  await Comment.sync({ force: false })
  console.log('✅ Comments table synced!')

  await ActivityLog.sync({ force: false })
  console.log('✅ Activity logs table synced!')

  console.log('🎉 All tables ready!');
})