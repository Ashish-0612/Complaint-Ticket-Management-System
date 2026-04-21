const { Department, Category } = require('../models/index')

// ========== GET ALL DEPARTMENTS ==========
const getAllDepartments = async (req, res) => {
  try {
    const departments = await Department.findAll({
      where: { isActive: true },
      order: [['name', 'ASC']]
    })

    res.status(200).json({
      success: true,
      count: departments.length,
      data: departments
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== GET ONE DEPARTMENT ==========
const getDepartmentById = async (req, res) => {
  try {
    const { id } = req.params

    const department = await Department.findByPk(id, {
      include: [
        {
          model: Category,
          as: 'categories',
          where: { isActive: true },
          required: false
        }
      ]
    })

    if (!department) {
      return res.status(404).json({
        success: false,
        message: `Department with id ${id} not found`
      })
    }

    res.status(200).json({
      success: true,
      data: department
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== CREATE DEPARTMENT ==========
const createDepartment = async (req, res) => {
  try {
    const { name, description } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Department name is required!'
      })
    }

    // Check if department already exists
    const existing = await Department.findOne({
      where: { name }
    })

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Department already exists!'
      })
    }

    const department = await Department.create({
      name,
      description: description || null
    })

    res.status(201).json({
      success: true,
      message: 'Department created successfully!',
      data: department
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== UPDATE DEPARTMENT ==========
const updateDepartment = async (req, res) => {
  try {
    const { id } = req.params
    const { name, description, isActive } = req.body

    const department = await Department.findByPk(id)

    if (!department) {
      return res.status(404).json({
        success: false,
        message: `Department with id ${id} not found`
      })
    }

    await department.update({
      name: name || department.name,
      description: description || department.description,
      isActive: isActive !== undefined ? isActive : department.isActive
    })

    res.status(200).json({
      success: true,
      message: 'Department updated successfully!',
      data: department
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== DELETE DEPARTMENT ==========
const deleteDepartment = async (req, res) => {
  try {
    const { id } = req.params

    const department = await Department.findByPk(id)

    if (!department) {
      return res.status(404).json({
        success: false,
        message: `Department with id ${id} not found`
      })
    }

    await department.destroy()

    res.status(200).json({
      success: true,
      message: 'Department deleted successfully!'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment
}