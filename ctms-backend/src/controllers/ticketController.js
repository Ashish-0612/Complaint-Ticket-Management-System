// Import models
const { Ticket, User, Department, Category } = require('../models/index')

// ========== GET ALL TICKETS ==========
const getAllTickets = async (req, res) => {
  try {
    // Get filter options from query string
    const { status, priority } = req.query

    // Build where condition
    const whereCondition = {}
    if (status) whereCondition.status = status
    if (priority) whereCondition.priority = priority

    // Fetch tickets from database
    const tickets = await Ticket.findAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    res.status(200).json({
      success: true,
      count: tickets.length,
      data: tickets
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== GET ONE TICKET ==========
const getTicketById = async (req, res) => {
  try {
    const { id } = req.params

    const ticket = await Ticket.findByPk(id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        },
        {
          model: Category,
          as: 'category',
          attributes: ['id', 'name']
        }
      ]
    })

    // If ticket not found
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with id ${id} not found`
      })
    }

    res.status(200).json({
      success: true,
      data: ticket
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== CREATE TICKET ==========
const createTicket = async (req, res) => {
  try {
    const { title, description, priority, departmentId, categoryId } = req.body

    // Validate required fields
    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Title is required!'
      })
    }

    if (!description) {
      return res.status(400).json({
        success: false,
        message: 'Description is required!'
      })
    }

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: 'Department is required!'
      })
    }

    // Create ticket in database
    const ticket = await Ticket.create({
      title,
      description,
      priority: priority || 'medium',
      status: 'open',
      userId: req.user.id,        // hardcoded for now — later from JWT!
      departmentId,
      categoryId: categoryId || null
    })

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully!',
      data: ticket
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== UPDATE TICKET ==========
const updateTicket = async (req, res) => {
  try {
    const { id } = req.params
    const { title, status, priority } = req.body

    // Find ticket first
    const ticket = await Ticket.findByPk(id)

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with id ${id} not found`
      })
    }

    // Update ticket
    await ticket.update({
      title: title || ticket.title,
      status: status || ticket.status,
      priority: priority || ticket.priority
    })

    res.status(200).json({
      success: true,
      message: `Ticket ${id} updated successfully!`,
      data: ticket
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== DELETE TICKET ==========
const deleteTicket = async (req, res) => {
  try {
    const { id } = req.params

    // Find ticket first
    const ticket = await Ticket.findByPk(id)

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with id ${id} not found`
      })
    }

    // Delete ticket
    await ticket.destroy()

    res.status(200).json({
      success: true,
      message: `Ticket ${id} deleted successfully!`
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
}