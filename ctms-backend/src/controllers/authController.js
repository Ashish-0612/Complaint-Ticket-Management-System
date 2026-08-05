// Import bcrypt for password hashing
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const crypto = require("crypto");

// Import User model
const { User } = require('../models/index')

// Import email functions
const { sendEmail, verificationEmail } = require("../config/email");

// ========== REGISTER ==========
const register = async (req, res) => {
  try {
    // Step 1 — Get data from request body
    const { name, email, password, role } = req.body

    // Step 2 — Validate required fields
    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required!'
      })
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required!'
      })
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required!'
      })
    }

    // Step 3 — Check if email already exists
    const existingUser = await User.findOne({
      where: { email }
    })

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered! Please login.'
      })
    }

    // Step 4 — Hash the password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // Step 5 — Save user to database
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      isVerified: false,
      verificationToken,
    });

    const verificationLink = `${getBackendUrl()}/api/auth/verify-email/${verificationToken}`;

    // Step 6 — Send welcome email
   await sendEmail({
     to: user.email,
     subject: "Verify Your Email - CTMS",
     html: verificationEmail(user.name, verificationLink),
   });
    // Step 7 — Send response (never send password back!)
    res.status(201).json({
      success: true,
      message: 'Account created successfully!',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== LOGIN ==========
const login = async (req, res) => {
  try {
    // Step 1 — Get email and password
    const { email, password } = req.body

    // Step 2 — Validate fields
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required!'
      })
    }

    if (!password) {
      return res.status(400).json({
        success: false,
        message: 'Password is required!'
      })
    }

    // Step 3 — Find user by email
    const user = await User.findOne({
      where: { email }
    })

    // Step 4 — If user not found
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password!'
      })
    }

    if (!user.isVerified) {
      return res.status(403).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // Step 5 — Compare password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,        // what user typed
      user.password    // hashed password in database
    )

    // Step 6 — If password wrong
    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password!'
      })
    }

    // Step 7 — Generate JWT token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: process.env.JWT_EXPIRE
      }
    )

    // Step 8 — Send token to user
    res.status(200).json({
      success: true,
      message: 'Login successful!',
      token: token,
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}



// ========== GET PROFILE ==========
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: ['id', 'name', 'email', 'role', 'isActive', 'createdAt']
    })

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      })
    }

    res.status(200).json({
      success: true,
      data: user
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

// ========== UPDATE PROFILE ==========
const updateProfile = async (req, res) => {
  try {
    const { name } = req.body

    if (!name) {
      return res.status(400).json({
        success: false,
        message: 'Name is required!'
      })
    }

    const user = await User.findByPk(req.user.id)

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found!'
      })
    }

    await user.update({ name })

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully!',
      data: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}
// ========== VERIFY EMAIL ==========
const FRONTEND_URL =
  process.env.FRONTEND_URL || "https://complaint-ticket-management-system-rho.vercel.app";

const DEFAULT_BACKEND_URL = "https://complaint-ticket-management-system-3.onrender.com";

// Get the backend base URL. Falls back to the deployed Render URL if
// BACKEND_URL is missing (e.g. not set in the hosting environment).
const getBackendUrl = () => {
  const backendUrl = process.env.BACKEND_URL;
  if (backendUrl && backendUrl !== "undefined" && backendUrl !== "") {
    return backendUrl.replace(/\/+$/, "");
  }
  return DEFAULT_BACKEND_URL;
};

const verificationSuccessPage = (name) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Email Verified ✅ - CTMS</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(145deg, #e8f0fe 0%, #dbeafe 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    .card {
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
      padding: 48px 40px;
      max-width: 440px;
      width: 100%;
      text-align: center;
    }
    .icon {
      width: 88px;
      height: 88px;
      background: #dcfce7;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
      animation: pop 0.5s ease-out;
    }
    @keyframes pop {
      0% { transform: scale(0.6); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    h1 { font-size: 26px; color: #111827; margin-bottom: 10px; }
    p {
      color: #6b7280;
      font-size: 15px;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    strong { color: #111827; }
    .btn {
      display: inline-block;
      background: #2563eb;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
      transition: background 0.2s, transform 0.2s;
    }
    .btn:hover { background: #1d4ed8; transform: translateY(-2px); }
    .btn-secondary {
      display: inline-block;
      margin-top: 12px;
      color: #2563eb;
      font-size: 14px;
      font-weight: 600;
      text-decoration: none;
    }
    .btn-secondary:hover { text-decoration: underline; }
    .footer { margin-top: 28px; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#16a34a" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </div>
    <h1>Email Verified!</h1>
    <p>
      Congratulations <strong>${name}</strong> 🎉<br />
      Your email has been verified successfully.<br />
      You can now sign in to your account.
    </p>
    <a class="btn" href="${FRONTEND_URL}/login">Go to Login →</a>
    <div class="footer">© 2026 CTMS · Complaint Ticket Management System</div>
  </div>
</body>
</html>
`;

const verificationErrorPage = (message) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verification Failed - CTMS</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Arial, sans-serif;
      background: linear-gradient(145deg, #fef2f2 0%, #fee2e2 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 16px;
    }
    .card {
      background: #ffffff;
      border-radius: 24px;
      box-shadow: 0 20px 50px rgba(0, 0, 0, 0.12);
      padding: 48px 40px;
      max-width: 440px;
      width: 100%;
      text-align: center;
    }
    .icon {
      width: 88px;
      height: 88px;
      background: #fee2e2;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 0 auto 24px;
    }
    h1 { font-size: 24px; color: #111827; margin-bottom: 10px; }
    p { color: #6b7280; font-size: 15px; line-height: 1.6; margin-bottom: 28px; }
    .btn {
      display: inline-block;
      background: #2563eb;
      color: #fff;
      font-weight: 700;
      font-size: 15px;
      text-decoration: none;
      padding: 14px 36px;
      border-radius: 12px;
      box-shadow: 0 8px 20px rgba(37, 99, 235, 0.3);
      transition: background 0.2s, transform 0.2s;
    }
    .btn:hover { background: #1d4ed8; transform: translateY(-2px); }
    .footer { margin-top: 28px; font-size: 12px; color: #9ca3af; }
  </style>
</head>
<body>
  <div class="card">
    <div class="icon">
      <svg width="44" height="44" viewBox="0 0 24 24" fill="none" stroke="#dc2626" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
    </div>
    <h1>Verification Failed</h1>
    <p>${message}</p>
    <a class="btn" href="${FRONTEND_URL}/register">Sign Up Again →</a>
    <div class="footer">© 2026 CTMS · Complaint Ticket Management System</div>
  </div>
</body>
</html>
`;

const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: {
        verificationToken: token
      }
    });

    if (!user) {
      return res.status(400).send(
        verificationErrorPage("This verification link is invalid or has already been used. Please register again to get a new link.")
      );
    }

    await user.update({
      isVerified: true,
      verificationToken: null
    });

    res.status(200).send(verificationSuccessPage(user.name));

  } catch (error) {
    res.status(500).send(
      verificationErrorPage("Something went wrong while verifying your email. Please try again later.")
    );
  }
};

// ========== CHANGE PASSWORD ==========
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required!'
      })
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'New password must be at least 6 characters!'
      })
    }

    const user = await User.findByPk(req.user.id)

    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password)

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect!'
      })
    }

    // Hash new password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)

    await user.update({ password: hashedPassword })

    res.status(200).json({
      success: true,
      message: 'Password changed successfully!'
    })

  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  register,
  login,
  verifyEmail,
  getProfile,
  updateProfile,
  changePassword,
};
