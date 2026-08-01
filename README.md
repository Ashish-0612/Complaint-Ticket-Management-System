# 🎫 CTMS — Complaint Ticket Management System

> A full-stack IT Helpdesk & Ticket Management System built with Node.js, Express.js, SQL Server, Sequelize ORM, and React.js.

---

## 📌 Table of Contents

- [About the Project](#about-the-project)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)
- [API Endpoints](#api-endpoints)
- [Role Based Access](#role-based-access)
- [Author](#author)

---

## 📖 About the Project

CTMS is a full-stack complaint ticket management system where:

- **Users** can raise support tickets for issues like hardware problems, salary disputes, network issues, etc.
- **Agents** handle assigned tickets and update their status.
- **Admins** manage all tickets, assign them to agents, and monitor the overall system.

This project demonstrates:
- ✅ REST API design
- ✅ JWT Authentication & Authorization
- ✅ Role Based Access Control (RBAC)
- ✅ Real SQL Server database with Sequelize ORM
- ✅ File uploads, Email notifications
- ✅ Search, Filter & Pagination
- ✅ React frontend with Context API & Protected Routes

---

## ✨ Features

### 👤 User Features
- ✅ Register & Login with JWT
- ✅ Create tickets with title, description, priority, department, category
- ✅ View personal tickets with status & priority badges
- ✅ Click ticket to view full details
- ✅ Add comments on tickets
- ✅ Receive welcome email on registration

### 🛡️ Admin Features
- ✅ View ALL tickets from all users
- ✅ Stats dashboard — Total, Open, In Progress, Resolved
- ✅ Assign tickets to agents via dropdown
- ✅ Update ticket status
- ✅ Click ticket to view full details

### 🔧 Agent Features
- ✅ View only assigned tickets
- ✅ Update ticket status
- ✅ Stats cards for personal workload
- ✅ Add comments on tickets

### 🔒 Security Features
- ✅ Password hashing with bcryptjs
- ✅ JWT token authentication
- ✅ Helmet security headers
- ✅ Rate limiting (prevent brute force)
- ✅ Input validation with express-validator
- ✅ Protected API routes
- ✅ Role-based access control

---

## 🛠️ Tech Stack

### Backend
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | v18+ | Runtime environment |
| Express.js | v4 | Web framework |
| MySQL | v8 | Relational database |
| Sequelize ORM | v6 | Database queries & models |
| JSON Web Token | - | Authentication |
| bcryptjs | - | Password hashing |
| Multer | - | File uploads |
| Nodemailer | - | Email notifications |
| Helmet | - | Security headers |
| express-rate-limit | - | Rate limiting |
| express-validator | - | Input validation |
| dotenv | - | Environment variables |
| cors | - | Cross-origin requests |

### Frontend
| Technology | Version | Purpose |
|------------|---------|---------|
| React | v18 | UI library |
| Vite | v5 | Build tool |
| Tailwind CSS | v3 | Utility-first styling |
| Axios | - | HTTP client |
| React Router DOM | v6 | Client-side routing |
| Context API | - | Global state management |

---

## 📁 Project Structure

```
CTMS/
│
├── README.md
│
├── ctms-backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.js       # MySQL connection
│   │   │   ├── email.js          # Nodemailer config
│   │   │   └── multer.js         # File upload config
│   │   │
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── ticketController.js
│   │   │   ├── departmentController.js
│   │   │   ├── categoryController.js
│   │   │   ├── commentController.js
│   │   │   └── attachmentController.js
│   │   │
│   │   ├── middleware/
│   │   │   ├── authMiddleware.js     # JWT verify + role check
│   │   │   ├── validationMiddleware.js
│   │   │   └── errorMiddleware.js
│   │   │
│   │   ├── models/
│   │   │   ├── index.js          # All associations
│   │   │   ├── User.js
│   │   │   ├── Ticket.js
│   │   │   ├── Department.js
│   │   │   ├── Category.js
│   │   │   ├── Comment.js
│   │   │   ├── ActivityLog.js
│   │   │   └── Attachment.js
│   │   │
│   │   └── routes/
│   │       ├── authRoutes.js
│   │       ├── ticketRoutes.js
│   │       ├── departmentRoutes.js
│   │       ├── categoryRoutes.js
│   │       ├── commentRoutes.js
│   │       ├── attachmentRoutes.js
│   │       └── userRoutes.js
│   │
│   ├── uploads/
│   │   └── tickets/              # Uploaded files
│   ├── .env                      # Environment variables
│   ├── app.js                    # Express app setup
│   └── package.json
│
└── ctms-frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Axios instance + interceptors
    │   │
    │   ├── components/
    │   │   └── ProtectedRoute.jsx
    │   │
    │   ├── context/
    │   │   └── AuthContext.jsx   # Global auth state
    │   │
    │   ├── pages/
    │   │   ├── Auth/
    │   │   │   ├── Login.jsx
    │   │   │   └── Register.jsx
    │   │   │
    │   │   ├── User/
    │   │   │   ├── Dashboard.jsx
    │   │   │   ├── CreateTicket.jsx
    │   │   │   └── TicketDetail.jsx
    │   │   │
    │   │   ├── Admin/
    │   │   │   └── AdminDashboard.jsx
    │   │   │
    │   │   └── Agent/
    │   │       └── AgentPanel.jsx
    │   │
    │   ├── App.jsx
    │   └── main.jsx
    │
    ├── index.html
    └── package.json
```

---

## ⚙️ Installation & Setup

### Prerequisites
- Node.js v18+
- SQL Server or SQL Server Express with TCP/IP enabled
- Git

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/Ashish-0612/Complaint-Ticket-Management-System.git
cd Complaint-Ticket-Management-System
```

### 2️⃣ Backend Setup

```bash
# Go to backend folder
cd ctms-backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env
# Fill in your values (see Environment Variables section)

# Start backend server
npm run dev
```

### 3️⃣ Database Setup

1. Install SQL Server/SQL Server Express and enable TCP/IP.
2. Create a database named `CTMS_DB` and configure SQL authentication.
3. Copy `ctms-backend/.env.example` to `ctms-backend/.env` and fill in your SQL Server credentials.
4. Run the backend; Sequelize creates the application tables automatically.

### 4️⃣ Seed Data (Optional)

```sql
-- Add departments
INSERT INTO departments (name, description, isActive) VALUES ('IT Support', 'Hardware and Software issues', true);
INSERT INTO departments (name, description, isActive) VALUES ('HR', 'Human Resources', true);
INSERT INTO departments (name, description, isActive) VALUES ('Finance', 'Salary and payments', true);

-- Add categories
INSERT INTO categories (name, departmentId, isActive) VALUES ('Hardware', 1, true);
INSERT INTO categories (name, departmentId, isActive) VALUES ('Software', 1, true);
INSERT INTO categories (name, departmentId, isActive) VALUES ('Network', 1, true);
```

### 5️⃣ Frontend Setup

```bash
# Go to frontend folder
cd ctms-frontend

# Install dependencies
npm install

# Start frontend
npm run dev
```

### 6️⃣ Open in Browser

```
Frontend → http://localhost:5173
Backend  → http://localhost:5000
```

---

## 🔐 Environment Variables

Create `.env` file in `ctms-backend/`:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
DB_HOST=127.0.0.1
DB_PORT=1433
DB_USER=sa
DB_PASSWORD=your_sql_server_password
DB_NAME=CTMS_DB

# JWT
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d

# Email (Gmail)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_16_digit_app_password
```

---

## 📡 API Endpoints

### 🔐 Auth Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login & get JWT token |

### 🎫 Ticket Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tickets` | All roles | Get tickets (filtered by role) |
| GET | `/api/tickets/:id` | All roles | Get single ticket |
| POST | `/api/tickets` | All roles | Create new ticket |
| PUT | `/api/tickets/:id` | Admin, Agent | Update ticket |
| DELETE | `/api/tickets/:id` | Admin | Delete ticket |

### 🏢 Department Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/departments` | All roles | Get all departments |
| POST | `/api/departments` | Admin | Create department |
| PUT | `/api/departments/:id` | Admin | Update department |
| DELETE | `/api/departments/:id` | Admin | Delete department |

### 📂 Category Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/categories` | All roles | Get all categories |
| POST | `/api/categories` | Admin | Create category |

### 💬 Comment Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/tickets/:id/comments` | All roles | Get ticket comments |
| POST | `/api/tickets/:id/comments` | All roles | Add comment |

### 📎 Attachment Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/tickets/:id/attachments` | All roles | Upload file |
| GET | `/api/tickets/:id/attachments` | All roles | Get attachments |

### 👥 User Routes
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/users/agents` | Admin | Get all agents |

---

## 🔐 Role Based Access Control

| Feature | User | Agent | Admin |
|---------|------|-------|-------|
| Register/Login | ✅ | ✅ | ✅ |
| Create Ticket | ✅ | ✅ | ✅ |
| View Own Tickets | ✅ | - | - |
| View Assigned Tickets | - | ✅ | - |
| View All Tickets | - | - | ✅ |
| Update Ticket Status | - | ✅ | ✅ |
| Assign Agent | - | - | ✅ |
| Add Comments | ✅ | ✅ | ✅ |
| Delete Ticket | - | - | ✅ |

---

## 👨‍💻 Author

**Ashish Yadav**
- 🎓 B.Tech Computer Science Engineering
- 🏫 Galgotias University (2023-2027)
- 💻 GitHub: [@Ashish-0612](https://github.com/Ashish-0612)

---

## 📄 License

This project is built for educational and placement purposes.

---

⭐ **If you found this project helpful, please give it a star!** ⭐