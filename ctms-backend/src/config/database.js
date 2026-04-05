// Import Sequelize
const { Sequelize } = require('sequelize')

// Create connection to MySQL database
const sequelize = new Sequelize(
  process.env.DB_NAME,      // database name → ctms_db
  process.env.DB_USER,      // username → root
  process.env.DB_PASSWORD,  // password → empty
  {
    host: process.env.DB_HOST,  // localhost
    dialect: 'mysql',           // we are using MySQL
    logging: false              // hide SQL logs in terminal
  }
)

// Test the connection
const connectDB = async () => {
  try {
    await sequelize.authenticate()
    console.log('✅ MySQL Database connected successfully!')
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

module.exports = { sequelize, connectDB }