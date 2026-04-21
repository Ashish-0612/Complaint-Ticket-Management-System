// Step 1 — Load .env file variables first — always at top!
require('dotenv').config()

const { connectDB } = require('./src/config/database')
const { User, Department, Category, Ticket } = require('./src/models/index')


// Step 2 — Import express package
const express = require('express')

// Step 3 — Import cors package
const cors = require('cors')

// Step 3 — Import our files
const ticketRoutes = require('./src/routes/ticketRoutes')
const errorHandler = require('./src/middleware/errorMiddleware')
const authRoutes = require('./src/routes/authRoutes')
const departmentRoutes = require('./src/routes/departmentRoutes')
const categoryRoutes = require('./src/routes/categoryRoutes')


// Step 4 — Create express application
const app = express()

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
  await User.sync({ alter: true })
  console.log('✅ Users table synced!')

  await Department.sync({ alter: true })
  console.log('✅ Departments table synced!')

  await Category.sync({ alter: true })
  console.log('✅ Categories table synced!')

  await Ticket.sync({ alter: true })
  console.log('✅ Tickets table synced!')

  console.log('🎉 All tables ready!');
})