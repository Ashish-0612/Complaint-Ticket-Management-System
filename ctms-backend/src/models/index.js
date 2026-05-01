// Import all models
const User = require('./User')
const Department = require('./Department')
const Category = require('./Category')
const Ticket = require('./Ticket')
const Comment = require('./Comment')           
const ActivityLog = require('./ActivityLog')
const Attachment = require('./Attachment')

// ========== ASSOCIATIONS ==========

// User has many Tickets
// One user can create many tickets
User.hasMany(Ticket, {
  foreignKey: 'userId',
  as: 'tickets'
})

// Ticket belongs to User
// Each ticket has one creator
Ticket.belongsTo(User, {
  foreignKey: 'userId',
  as: 'creator'
})

// Department has many Categories
// IT Support has Hardware, Software, Network
Department.hasMany(Category, {
  foreignKey: 'departmentId',
  as: 'categories'
})

// Category belongs to Department
Category.belongsTo(Department, {
  foreignKey: 'departmentId',
  as: 'department'
})

// Department has many Tickets
Department.hasMany(Ticket, {
  foreignKey: 'departmentId',
  as: 'tickets'
})

// Ticket belongs to Department
Ticket.belongsTo(Department, {
  foreignKey: 'departmentId',
  as: 'department'
})

// Category has many Tickets
Category.hasMany(Ticket, {
  foreignKey: 'categoryId',
  as: 'tickets'
})

// Ticket belongs to Category
Ticket.belongsTo(Category, {
  foreignKey: 'categoryId',
  as: 'category'
})

// Agent (User) has many assigned Tickets
User.hasMany(Ticket, {
  foreignKey: 'agentId',
  as: 'assignedTickets'
})

// Ticket belongs to Agent
Ticket.belongsTo(User, {
  foreignKey: 'agentId',
  as: 'agent'
})
// ========== NEW ASSOCIATIONS ==========

// Ticket has many Comments
Ticket.hasMany(Comment, { foreignKey: 'ticketId', as: 'comments' })
Comment.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' })

// User has many Comments
User.hasMany(Comment, { foreignKey: 'userId', as: 'comments' })
Comment.belongsTo(User, { foreignKey: 'userId', as: 'author' })

// Ticket has many ActivityLogs
Ticket.hasMany(ActivityLog, { foreignKey: 'ticketId', as: 'logs' })
ActivityLog.belongsTo(Ticket, { foreignKey: 'ticketId', as: 'ticket' })

// User has many ActivityLogs
User.hasMany(ActivityLog, { foreignKey: 'userId', as: 'activities' })
ActivityLog.belongsTo(User, { foreignKey: 'userId', as: 'user' })




// Ticket has many Attachments
Ticket.hasMany(Attachment, {
  foreignKey: 'ticketId',
  as: 'attachments'
})
Attachment.belongsTo(Ticket, {
  foreignKey: 'ticketId',
  as: 'ticket'
})

// User has many Attachments
User.hasMany(Attachment, {
  foreignKey: 'userId',
  as: 'attachments'
})
Attachment.belongsTo(User, {
  foreignKey: 'userId',
  as: 'uploader'
})

// Export all models
module.exports = {
  User,
  Department,
  Category,
  Ticket,
  Comment,
  ActivityLog,
  Attachment
}