const express = require('express')
const router = express.Router({ mergeParams: true })

const {
  uploadFile,
  getAttachments,
  deleteAttachment,
  upload
} = require('../controllers/attachmentController')

const { protect, authorize } = require('../middleware/authMiddleware')

// ========== ATTACHMENT ROUTES ==========

// GET all attachments for ticket
router.get('/', protect, getAttachments)

// POST upload file to ticket
router.post('/', protect, upload.single('file'), uploadFile)

// DELETE attachment → admin only
router.delete('/:id', protect, authorize('admin'), deleteAttachment)

module.exports = router