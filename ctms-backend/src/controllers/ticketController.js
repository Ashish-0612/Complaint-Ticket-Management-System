// Import models
const { Ticket, User, Department, Category } = require('../models/index')
const { sendEmail, ticketCreatedEmail } = require('../config/email')

// ========== GET ALL TICKETS ==========
const getAllTickets = async (req, res) => {
  try {
    // Get filter + search + pagination options
    const {
      status,
      priority,
      search,
      page = 1,
      limit = 10
    } = req.query

    // Build where condition
    const whereCondition = {}

    // Filter by status
    if (status) whereCondition.status = status

    // Filter by priority
    if (priority) whereCondition.priority = priority

    // Search by title or description
    if (search) {
      const { Op } = require('sequelize')
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ]
    }

    // Pagination
    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)
    const offset = (pageNumber - 1) * limitNumber

    // Fetch tickets from database
    const { count, rows: tickets } = await Ticket.findAndCountAll({
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
      order: [['createdAt', 'DESC']],
      limit: limitNumber,
      offset: offset
    })

    // Calculate total pages
    const totalPages = Math.ceil(count / limitNumber)

    res.status(200).json({
      success: true,
      count: count,
      totalPages: totalPages,
      currentPage: pageNumber,
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

    // Send ticket created email
      await sendEmail({
        to: req.user.email,
        subject: `Ticket #${ticket.id} Created Successfully!`,
        html: ticketCreatedEmail(req.user.name, ticket.id, ticket.title)
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