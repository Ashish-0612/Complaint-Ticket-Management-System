// Import express
const express = require('express')

// Create a mini application just for ticket routes
const router = express.Router()

// Import controller — we create this in next step
const ticketController = require('../controllers/ticketController')

// ========== TICKET ROUTES ==========

// GET /api/tickets — get ALL tickets
router.get('/', ticketController.getAllTickets)

// GET /api/tickets/:id — get ONE ticket
router.get('/:id', ticketController.getTicketById)

// POST /api/tickets — CREATE new ticket
router.post('/', ticketController.createTicket)

// PUT /api/tickets/:id — UPDATE ticket
router.put('/:id', ticketController.updateTicket)

// DELETE /api/tickets/:id — DELETE ticket
router.delete('/:id', ticketController.deleteTicket)

// Share this router with other files
module.exports = router