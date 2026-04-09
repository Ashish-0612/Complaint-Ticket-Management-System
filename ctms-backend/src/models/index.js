// Import all models
const User = require('./User')
const Department = require('./Department')
const Category = require('./Category')
const Ticket = require('./Ticket')

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

// Export all models
module.exports = {
  User,
  Department,
  Category,
  Ticket
}