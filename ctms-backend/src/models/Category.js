const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Category = sequelize.define('Category', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  name: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Foreign Key — links to Department
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }

}, {
  tableName: 'categories',
  timestamps: true
})

module.exports = Category