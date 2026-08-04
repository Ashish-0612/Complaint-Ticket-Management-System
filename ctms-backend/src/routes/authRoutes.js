const express = require("express");
const router = express.Router();

const {
  register,
  login,
  verifyEmail,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/authController");
const {
  validateRegister,
  validateLogin,
} = require("../middleware/validationMiddleware");
const { protect } = require("../middleware/authMiddleware");

// ========== AUTH ROUTES ==========
router.post("/register", validateRegister, register);
router.post("/login", validateLogin, login);
router.get("/verify-email/:token", verifyEmail);

// ========== PROFILE ROUTES ==========
router.get("/profile", protect, getProfile);
router.put("/profile", protect, updateProfile);
router.put("/change-password", protect, changePassword);


module.exports = router;
