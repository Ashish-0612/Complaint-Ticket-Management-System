const { DataTypes } = require('sequelize')
const { sequelize } = require('../config/database')

const Attachment = sequelize.define('Attachment', {

  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },

  // Which ticket this file belongs to
  ticketId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Who uploaded this file
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // Original file name
  originalName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // Saved file name (unique)
  fileName: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // File path on server
  filePath: {
    type: DataTypes.STRING,
    allowNull: false
  },

  // File size in bytes
  fileSize: {
    type: DataTypes.INTEGER,
    allowNull: false
  },

  // File type (image/pdf etc)
  mimeType: {
    type: DataTypes.STRING,
    allowNull: false
  }

}, {
  tableName: 'attachments',
  timestamps: true
})

module.exports = Attachment