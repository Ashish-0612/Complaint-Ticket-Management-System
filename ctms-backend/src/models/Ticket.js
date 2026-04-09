const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Ticket = sequelize.define('Ticket', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Ticket title
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Full description of problem
  description: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  // Ticket status
  status: {
    type: DataTypes.ENUM(
      'open',
      'in-progress',
      'resolved',
      'closed',
      'reopened'
    ),
    defaultValue: 'open'
  },

  // Ticket priority
  priority: {
    type: DataTypes.ENUM(
      'critical',
      'high',
      'medium',
      'low'
    ),
    defaultValue: 'medium'
  },

  // Who created this ticket
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Which agent is handling this ticket
  agentId: {
    type: DataTypes.INTEGER,
    allowNull: true   // optional — not assigned yet!
  },

  // Which department
  departmentId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Which category
  categoryId: {
    type: DataTypes.INTEGER,
    allowNull: true
  },

  // When should ticket be resolved (SLA)
  dueDate: {
    type: DataTypes.DATE,
    allowNull: true
  }

}, {
  tableName: 'tickets',
  timestamps: true
})

module.exports = Ticket