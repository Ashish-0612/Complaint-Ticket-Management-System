const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Comment = sequelize.define('Comment', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Comment text
  comment: {
    type: DataTypes.TEXT,
    allowNull: false
  },

  // Which ticket this comment belongs to
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Who wrote this comment
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Is this an internal note? (only agents/admin see)
  isInternal: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }

}, {
  tableName: 'comments',
  timestamps: true
})

module.exports = Comment