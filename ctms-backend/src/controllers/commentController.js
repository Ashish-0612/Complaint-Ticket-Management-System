const { Comment, User, ActivityLog } = require('../models/index')

// ========== GET ALL COMMENTS FOR A TICKET ==========
const getComments = async (req, res) => {
  try {
    const { ticketId } = req.params

    const comments = await Comment.findAll({
      where: { ticketId },
      include: [
        {
          model: User,
          as: 'author',
          attributes: ['id', 'name', 'role']
        }
      ],
      order: [['createdAt', 'ASC']]
    })

    res.status(200).json({
      success: true,
      count: comments.length,
      data: comments
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== ADD COMMENT TO TICKET ==========
const addComment = async (req, res) => {
  try {
    const { ticketId } = req.params
    const { comment, isInternal } = req.body

    // Validate comment
    if (!comment) {
      return res.status(400).json({
        success: false,
        message: 'Comment text is required!'
      })
    }

    // Create comment
    const newComment = await Comment.create({
      comment,
      ticketId,
      userId: req.user.id,
      isInternal: isInternal || false
    })

    // Log this activity
    await ActivityLog.create({
      ticketId,
      userId: req.user.id,
      action: 'comment_added',
      details: `Comment added by ${req.user.name}`
    })

    res.status(201).json({
      success: true,
      message: 'Comment added successfully!',
      data: newComment
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== DELETE COMMENT ==========
const deleteComment = async (req, res) => {
  try {
    const { id } = req.params

    const comment = await Comment.findByPk(id)

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Comment not found!'
      })
    }

    await comment.destroy()

    res.status(200).json({
      success: true,
      message: 'Comment deleted successfully!'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== GET ACTIVITY LOGS ==========
const getActivityLogs = async (req, res) => {
  try {
    const { ticketId } = req.params

    const logs = await ActivityLog.findAll({
      where: { ticketId },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'name', 'role']
        }
      ],
      order: [['createdAt', 'ASC']]
    })

    res.status(200).json({
      success: true,
      count: logs.length,
      data: logs
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  getComments,
  addComment,
  deleteComment,
  getActivityLogs
}