// ================= LOAD ENV =================
require("dotenv").config();

// ================= JWT DEFAULT =================

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ JWT_SECRET missing. Using development secret.");
  process.env.JWT_SECRET = "dev_secret_change_me";
}

if (!process.env.JWT_EXPIRE) {
  process.env.JWT_EXPIRE = "7d";
}

// ================= IMPORTS =================

const express = require("express");
const path = require("path");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

// Database
const { connectDB } = require("./src/config/database");

// Models
const {
  User,
  Department,
  Category,
  Ticket,
  Comment,
  ActivityLog,
  Attachment,
} = require("./src/models/index");

// Routes
const authRoutes = require("./src/routes/authRoutes");
const ticketRoutes = require("./src/routes/ticketRoutes");
const departmentRoutes = require("./src/routes/departmentRoutes");
const categoryRoutes = require("./src/routes/categoryRoutes");
const userRoutes = require("./src/routes/userRoutes");
const commentRoutes = require("./src/routes/commentRoutes");
const attachmentRoutes = require("./src/routes/attachmentRoutes");

// Error Middleware
const errorHandler = require("./src/middleware/errorMiddleware");

// ================= APP =================

const app = express();

app.set("trust proxy", 1);

// ================= SECURITY =================

app.use(helmet());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://127.0.0.1:5173",
      "https://complaint-ticket-management-system-kiy9-7a6ohvoaa-ashu-f213.vercel.app",
      "https://complaint-ticket-management-system-rho.vercel.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);



// ================= STATIC FILES =================

app.use("/uploads", express.static(path.resolve(__dirname, "uploads")));

// ================= RATE LIMIT =================

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});

app.use(limiter);

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
});

app.use("/api/auth", authLimiter);

// ================= BODY PARSER =================

app.use(express.json());

app.use(
  express.urlencoded({
    extended: true,
  }),
);

// ================= HOME =================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "CTMS API is running!",
    developer: "Ashu",
  });
});

// ================= ROUTES =================

app.use("/api/auth", authRoutes);

app.use("/api/tickets", ticketRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/categories", categoryRoutes);

app.use("/api/users", userRoutes);

app.use("/api/tickets/:ticketId/comments", commentRoutes);

app.use("/api/tickets/:ticketId/attachments", attachmentRoutes);

// ================= 404 =================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Cannot find ${req.method} ${req.originalUrl}`,
  });
});

// ================= ERROR =================

app.use(errorHandler);

// ================= SERVER =================

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
  console.log(`✅ CTMS Server running on port ${PORT}`);

  console.log(`🌐 URL: http://localhost:${PORT}`);

  try {
    await connectDB();

    await User.sync({ alter: true });
    console.log("✅ Users table synced");

    await Department.sync({ force: false });
    console.log("✅ Departments table synced");

    await Category.sync({ force: false });
    console.log("✅ Categories table synced");

    await Ticket.sync({ force: false });
    console.log("✅ Tickets table synced");

    await Comment.sync({ force: false });
    console.log("✅ Comments table synced");

    await ActivityLog.sync({ force: false });
    console.log("✅ Activity logs table synced");

    await Attachment.sync({ force: false });
    console.log("✅ Attachments table synced");

    console.log("🎉 All tables ready!");
  } catch (error) {
    console.error("❌ Database/Sync Error:", error.message);
  }
});
