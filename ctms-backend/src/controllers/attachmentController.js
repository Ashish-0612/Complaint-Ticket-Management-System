const { Attachment, User } = require('../models/index')
const upload = require('../config/multer')

// ========== UPLOAD FILE ==========
const uploadFile = async (req, res) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please select a file to upload!'
      })
    }

    const { ticketId } = req.params

    // Save file info to database
    const attachment = await Attachment.create({
      ticketId,
      userId: req.user.id,
      originalName: req.file.originalname,
      fileName: req.file.filename,
      filePath: req.file.path,
      fileSize: req.file.size,
      mimeType: req.file.mimetype
    })

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully!',
      data: {
        id: attachment.id,
        originalName: attachment.originalName,
        fileSize: attachment.fileSize,
        mimeType: attachment.mimeType,
        url: `http://localhost:5000/${attachment.filePath}`
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== GET ALL ATTACHMENTS FOR TICKET ==========
const getAttachments = async (req, res) => {
  try {
    const { ticketId } = req.params

    const attachments = await Attachment.findAll({
      where: { ticketId },
      include: [
        {
          model: User,
          as: 'uploader',
          attributes: ['id', 'name']
        }
      ],
      order: [['createdAt', 'DESC']]
    })

    res.status(200).json({
      success: true,
      count: attachments.length,
      data: attachments.map(att => ({
        id: att.id,
        originalName: att.originalName,
        fileSize: att.fileSize,
        mimeType: att.mimeType,
        uploadedBy: att.uploader,
        url: `http://localhost:5000/${att.filePath}`,
        createdAt: att.createdAt
      }))
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== DELETE ATTACHMENT ==========
const deleteAttachment = async (req, res) => {
  try {
    const { id } = req.params

    const attachment = await Attachment.findByPk(id)

    if (!attachment) {
      return res.status(404).json({
        success: false,
        message: 'Attachment not found!'
      })
    }

    await attachment.destroy()

    res.status(200).json({
      success: true,
      message: 'Attachment deleted successfully!'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  uploadFile,
  getAttachments,
  deleteAttachment,
  upload
}