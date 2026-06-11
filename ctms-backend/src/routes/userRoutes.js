const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { User } = require("../models/index");

// GET /api/users/agents — sirf agents ki list
router.get("/agents", protect, authorize("admin"), async (req, res) => {
  try {
    const agents = await User.findAll({
      where: {
        role: "agent",
        isActive: true,
      },
      attributes: ["id", "name", "email"],
    });

    res.status(200).json({
      success: true,
      data: agents,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

module.exports = router;
