const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/authMiddleware");
const { User } = require("../models/index");

// GET /api/users/agents — sirf agents
router.get("/agents", protect, authorize("admin"), async (req, res) => {
  try {
    const agents = await User.findAll({
      where: { role: "agent", isActive: true },
      attributes: ["id", "name", "email"],
    });
    res.status(200).json({ success: true, data: agents });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// GET /api/users — sabke users
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "isActive", "createdAt"],
      order: [["createdAt", "DESC"]],
    });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/users/:id/role — role change
router.put("/:id/role", protect, authorize("admin"), async (req, res) => {
  try {
    const { role } = req.body;
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    // Admin apna role change nahi kar sakta!
    if (user.id === req.user.id) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot change your own role!" });
    }

    await user.update({ role });

    res.status(200).json({
      success: true,
      message: "Role updated successfully!",
      data: { id: user.id, name: user.name, role: user.role },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// PUT /api/users/:id/status — active/inactive
router.put("/:id/status", protect, authorize("admin"), async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found!" });
    }

    if (user.id === req.user.id) {
      return res
        .status(400)
        .json({ success: false, message: "Cannot deactivate yourself!" });
    }

    await user.update({ isActive: !user.isActive });

    res.status(200).json({
      success: true,
      message: `User ${user.isActive ? "activated" : "deactivated"} successfully!`,
      data: { id: user.id, name: user.name, isActive: user.isActive },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
