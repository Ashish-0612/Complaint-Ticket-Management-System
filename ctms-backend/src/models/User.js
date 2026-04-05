// Import DataTypes from sequelize
const { DataTypes } = require('sequelize')

// Import our database connection
const { sequelize } = require('../config/database')

// Define User Model
const User = sequelize.define('User', {

  // ID field — unique number for each user
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Name field
  name: {
    type: DataTypes.STRING,
    allowNull: false  // name is required!
  },

  // Email field
  email: {
    type: DataTypes.STRING,
    allowNull: false,  // email is required!
    unique: true       // no two users same email!
  },

  // Password field
  password: {
    type: DataTypes.STRING,
    allowNull: false  // password is required!
  },

  // Role field
  role: {
    type: DataTypes.ENUM('admin', 'agent', 'user'),
    defaultValue: 'user'  // default role is user
  },

  // Is account active?
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, {
  // Table name in database
  tableName: 'users',

  // Automatically add createdAt and updatedAt
  timestamps: true
})

module.exports = User