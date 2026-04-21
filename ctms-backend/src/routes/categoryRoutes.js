const express = require('express')
const router = express.Router()

const {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/categoryController')

const { protect, authorize } = require('../middleware/authMiddleware')

// ========== CATEGORY ROUTES ==========

// GET all categories → all logged in users
router.get('/', protect, getAllCategories)

// GET one category → all logged in users
router.get('/:id', protect, getCategoryById)

// POST create category → admin only
router.post('/', protect, authorize('admin'), createCategory)

// PUT update category → admin only
router.put('/:id', protect, authorize('admin'), updateCategory)

// DELETE category → admin only
router.delete('/:id', protect, authorize('admin'), deleteCategory)

module.exports = router