const express = require('express')
const router = express.Router()

const {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
} = require('../controllers/departmentController')

const { protect, authorize } = require('../middleware/authMiddleware')

// ========== DEPARTMENT ROUTES ==========

// GET all departments → all logged in users
router.get('/', protect, getAllDepartments)

// GET one department → all logged in users
router.get('/:id', protect, getDepartmentById)

// POST create department → admin only
router.post('/', protect, authorize('admin'), createDepartment)

// PUT update department → admin only
router.put('/:id', protect, authorize('admin'), updateDepartment)

// DELETE department → admin only
router.delete('/:id', protect, authorize('admin'), deleteDepartment)

module.exports = router