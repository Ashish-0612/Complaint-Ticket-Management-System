const express = require('express')
const router = express.Router({ mergeParams: true })

const {
  getComments,
  addComment,
  deleteComment,
  getActivityLogs
} = require('../controllers/commentController')

const { protect, authorize } = require('../middleware/authMiddleware')

// ========== COMMENT ROUTES ==========

// GET all comments for ticket
router.get('/', protect, getComments)

// POST add comment to ticket
router.post('/', protect, addComment)

// DELETE comment → admin only
router.delete('/:id', protect, authorize('admin'), deleteComment)

// GET activity logs for ticket
router.get('/logs', protect, authorize('admin', 'agent'), getActivityLogs)

module.exports = router