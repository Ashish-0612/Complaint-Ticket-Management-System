const { Category, Department } = require('../models/index')

// ========== GET ALL CATEGORIES ==========
const getAllCategories = async (req, res) => {
  try {
    const { departmentId } = req.query

    const whereCondition = { isActive: true }
    if (departmentId) whereCondition.departmentId = departmentId

    const categories = await Category.findAll({
      where: whereCondition,
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        }
      ],
      order: [['name', 'ASC']]
    })

    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== GET ONE CATEGORY ==========
const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findByPk(id, {
      include: [
        {
          model: Department,
          as: 'department',
          attributes: ['id', 'name']
        }
      ]
    })

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category with id ${id} not found`
      })
    }

    res.status(200).json({
      success: true,
      data: category
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== CREATE CATEGORY ==========
const createCategory = async (req, res) => {
  try {
    const { name, departmentId } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Category name is required!'
      })
    }

    if (!departmentId) {
      return res.status(400).json({
        success: false,
        message: 'Department is required!'
      })
    }

    // Check if department exists
    const department = await Department.findByPk(departmentId)
    if (!department) {
      return res.status(404).json({
        success: false,
        message: 'Department not found!'
      })
    }

    const category = await Category.create({
      name,
      departmentId
    })

    res.status(201).json({
      success: true,
      message: 'Category created successfully!',
      data: category
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== UPDATE CATEGORY ==========
const updateCategory = async (req, res) => {
  try {
    const { id } = req.params
    const { name, isActive } = req.body

    const category = await Category.findByPk(id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category with id ${id} not found`
      })
    }

    await category.update({
      name: name || category.name,
      isActive: isActive !== undefined ? isActive : category.isActive
    })

    res.status(200).json({
      success: true,
      message: 'Category updated successfully!',
      data: category
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== DELETE CATEGORY ==========
const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params

    const category = await Category.findByPk(id)

    if (!category) {
      return res.status(404).json({
        success: false,
        message: `Category with id ${id} not found`
      })
    }

    await category.destroy()

    res.status(200).json({
      success: true,
      message: 'Category deleted successfully!'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory
}