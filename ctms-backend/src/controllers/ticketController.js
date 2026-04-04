// ========== GET ALL TICKETS ==========
// This runs when someone visits GET /api/tickets

const getAllTickets = (req, res) => {

  // req.query has filter options
  // Example: /api/tickets?status=open
  const { status, priority } = req.query

  // Dummy data for now — later comes from MySQL database
  let tickets = [
    {
      id: 1,
      title: 'Laptop not working',
      status: 'open',
      priority: 'high',
      createdBy: 'Ashu'
    },
    {
      id: 2,
      title: 'Internet is slow',
      status: 'in-progress',
      priority: 'medium',
      createdBy: 'Rahul'
    },
    {
      id: 3,
      title: 'Printer broken',
      status: 'closed',
      priority: 'low',
      createdBy: 'Priya'
    }
  ]

  // If user sent ?status=open → filter by status
  if (status) {
    tickets = tickets.filter(ticket => ticket.status === status)
  }

  // If user sent ?priority=high → filter by priority
  if (priority) {
    tickets = tickets.filter(ticket => ticket.priority === priority)
  }

  // Send response back
  res.status(200).json({
    success: true,
    count: tickets.length,
    data: tickets
  })
}

// ========== GET ONE TICKET ==========
// This runs when someone visits GET /api/tickets/1

const getTicketById = (req, res) => {

  // Get id from URL
  // Example: /api/tickets/5 → req.params.id = "5"
  const { id } = req.params

  // Dummy ticket for now
  const ticket = {
    id: Number(id),
    title: 'Laptop not working',
    description: 'Screen goes black after 5 minutes',
    status: 'open',
    priority: 'high',
    createdBy: 'Ashu',
    createdAt: new Date()
  }

  // Send response
  res.status(200).json({
    success: true,
    data: ticket
  })
}

// ========== CREATE TICKET ==========
// This runs when someone sends POST /api/tickets

const createTicket = (req, res) => {

  // Read data from request body
  // User sends → { title: "Bug", description: "...", priority: "high" }
  const { title, description, priority } = req.body

  // Check if title is missing
  if (!title) {
    return res.status(400).json({
      success: false,
      message: 'Title is required!'
    })
  }

  // Check if description is missing
  if (!description) {
    return res.status(400).json({
      success: false,
      message: 'Description is required!'
    })
  }

  // Build new ticket object
  const newTicket = {
    id: Math.floor(Math.random() * 1000),
    title,
    description,
    priority: priority || 'medium',
    status: 'open',
    createdAt: new Date()
  }

  // Send 201 Created response
  res.status(201).json({
    success: true,
    message: 'Ticket created successfully!',
    data: newTicket
  })
}

// ========== UPDATE TICKET ==========
// This runs when someone sends PUT /api/tickets/1

const updateTicket = (req, res) => {

  // Get id from URL
  const { id } = req.params

  // Get updated data from body
  const { title, status, priority } = req.body

  // Valid status values only
  const validStatuses = ['open', 'in-progress', 'resolved', 'closed']

  // Check if status value is valid
  if (status && !validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      message: `Status must be one of: ${validStatuses.join(', ')}`
    })
  }

  // Send response
  res.status(200).json({
    success: true,
    message: `Ticket ${id} updated successfully!`,
    data: { id: Number(id), title, status, priority }
  })
}

// ========== DELETE TICKET ==========
// This runs when someone sends DELETE /api/tickets/1

const deleteTicket = (req, res) => {

  // Get id from URL
  const { id } = req.params

  // Send response
  res.status(200).json({
    success: true,
    message: `Ticket ${id} deleted successfully!`
  })
}

// ========== EXPORT ALL FUNCTIONS ==========
// Share all functions so ticketRoutes.js can use them

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
}