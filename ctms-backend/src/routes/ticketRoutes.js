// Import express
const express = require('express')

// Create a mini application just for ticket routes
const router = express.Router()

// Import controller — we create this in next step
const ticketController = require('../controllers/ticketController');

// Import auth middleware
const { protect } = require('../middleware/authMiddleware')

// ========== TICKET ROUTES ==========

// GET /api/tickets — get ALL tickets
router.get('/', protect, ticketController.getAllTickets)

// GET /api/tickets/:id — get ONE ticket
router.get('/:id', protect,  ticketController.getTicketById)

// POST /api/tickets — CREATE new ticket
router.post('/',  protect, ticketController.createTicket)

// PUT /api/tickets/:id — UPDATE ticket
router.put('/:id',  protect,ticketController.updateTicket)

// DELETE /api/tickets/:id — DELETE ticket
router.delete('/:id', protect, ticketController.deleteTicket)

// Share this router with other files
module.exports = router