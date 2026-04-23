const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const ActivityLog = sequelize.define('ActivityLog', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Which ticket this log belongs to
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Who did the action
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // What action was done
  action: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Extra details about the action
  details: {
    type: DataTypes.TEXT,
    allowNull: true
  }

}, {
  tableName: 'activity_logs',
  timestamps: true
})

module.exports = ActivityLog