// Import models
const { Ticket, User, Department, Category, Comment, ActivityLog, Attachment } = require('../models/index')
const { sendEmail, ticketCreatedEmail, ticketResolvedEmail, ticketUpdatedEmail } = require('../config/email')
const fs = require('fs').promises

// ========== GET ALL TICKETS ==========
  // GET ALL TICKETS
const getAllTickets = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 10 } = req.query

    const pageNumber = parseInt(page)
    const limitNumber = parseInt(limit)
    const offset = (pageNumber - 1) * limitNumber

    // Filter object
    let whereCondition = {}

    // Agar agent hai → sirf uske assigned tickets
    if (req.user.role === 'agent') {
      whereCondition.agentId = req.user.id
    }

    // Agar user hai → sirf uske apne tickets
    if (req.user.role === 'user') {
      whereCondition.userId = req.user.id
    }

    // Admin → sabke tickets (no filter)

    if (status) whereCondition.status = status
    if (priority) whereCondition.priority = priority

    if (search) {
      whereCondition[Op.or] = [
        { title: { [Op.like]: `%${search}%` } },
        { description: { [Op.like]: `%${search}%` } }
      ]
    }

    const { count, rows: tickets } = await Ticket.findAndCountAll({
      where: whereCondition,
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'agent',
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
    const ticket = await Ticket.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'creator',
          attributes: ['id', 'name', 'email']
        },
        {
          model: User,
          as: 'agent',
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

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found!'
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
    const emailResult = await sendEmail({
      to: req.user.email,
      subject: `Ticket #${ticket.id} Created Successfully!`,
      html: ticketCreatedEmail(req.user.name, ticket.id, ticket.title)
    })

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully!',
      data: ticket,
      emailPreview: emailResult?.preview || null
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
    const { id } = req.params;
    const { title, status, priority, agentId } = req.body; // ← agentId add karo

    const ticket = await Ticket.findByPk(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: `Ticket with id ${id} not found`,
      });
    }

    // Capture previous state
    const prevStatus = ticket.status
    const prevAgentId = ticket.agentId

    await ticket.update({
      title: title || ticket.title,
      status: status || ticket.status,
      priority: priority || ticket.priority,
      agentId: agentId !== undefined ? agentId : ticket.agentId,
    });

    // Fetch creator and agent details for notifications
    const creator = await User.findByPk(ticket.userId)
    const agent = ticket.agentId ? await User.findByPk(ticket.agentId) : null

    // If status changed to resolved — send resolved email to creator
    let emailPreview = null
    if (status && status !== prevStatus) {
      if (status === 'resolved') {
        if (creator) {
          const resEmail = await sendEmail({
            to: creator.email,
            subject: `Ticket #${ticket.id} Resolved`,
            html: ticketResolvedEmail(creator.name, ticket.id, ticket.title)
          })
          if (resEmail?.preview) emailPreview = resEmail.preview
        }
      } else {
        // Generic status update — notify creator
        if (creator) {
          const resEmail = await sendEmail({
            to: creator.email,
            subject: `Ticket #${ticket.id} Updated`,
            html: ticketUpdatedEmail(creator.name, ticket.id, ticket.title, ticket.status)
          })
          if (resEmail?.preview) emailPreview = resEmail.preview
        }
      }
    }

    // If agent assigned or changed, notify the agent
    if (ticket.agentId && ticket.agentId !== prevAgentId && agent) {
      const resEmail2 = await sendEmail({
        to: agent.email,
        subject: `New Ticket Assigned: #${ticket.id}`,
        html: ticketUpdatedEmail(agent.name, ticket.id, ticket.title, ticket.status)
      })
      if (resEmail2?.preview) emailPreview = resEmail2.preview || emailPreview
    }

    res.status(200).json({
      success: true,
      message: `Ticket ${id} updated successfully!`,
      data: ticket,
      emailPreview: emailPreview
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

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

      const attachments = await Attachment.findAll({ where: { ticketId: id } })
      await Promise.all([
        Comment.destroy({ where: { ticketId: id } }),
        ActivityLog.destroy({ where: { ticketId: id } }),
        Attachment.destroy({ where: { ticketId: id } }),
        ...attachments.map((attachment) =>
          fs.unlink(attachment.filePath).catch(() => {}),
        ),
      ])

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