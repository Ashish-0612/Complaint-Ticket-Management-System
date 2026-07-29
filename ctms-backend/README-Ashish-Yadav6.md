md# CTMS Backend API
## Complaint Ticket Management System

A production-ready REST API built with Node.js, Express, MySQL and Sequelize ORM.

---

## 🛠️ Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL + Sequelize ORM
- **Authentication:** JWT + bcrypt
- **File Upload:** Multer
- **Email:** Nodemailer
- **Security:** Helmet + Rate Limiting
- **Validation:** express-validator

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MySQL (XAMPP)
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/ctms-backend.git

# Install dependencies
cd ctms-backend
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your values

# Start server
npm run dev
```

---

## 📌 Environment Variables
PORT=5000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=ctms_db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
EMAIL_FROM=CTMS Support your_email@gmail.com

---

## 📁 Project Structure
ctms-backend/
├── src/
│   ├── config/
│   │   ├── database.js
│   │   ├── email.js
│   │   └── multer.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── ticketController.js
│   │   ├── departmentController.js
│   │   ├── categoryController.js
│   │   ├── commentController.js
│   │   └── attachmentController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   ├── errorMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── index.js
│   │   ├── User.js
│   │   ├── Ticket.js
│   │   ├── Department.js
│   │   ├── Category.js
│   │   ├── Comment.js
│   │   ├── ActivityLog.js
│   │   └── Attachment.js
│   └── routes/
│       ├── authRoutes.js
│       ├── ticketRoutes.js
│       ├── departmentRoutes.js
│       ├── categoryRoutes.js
│       ├── commentRoutes.js
│       └── attachmentRoutes.js
├── uploads/
├── .env
├── .gitignore
├── package.json
└── server.js

---

## 🔐 API Endpoints

### Auth
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | /api/auth/register | Register account | Public |
| POST | /api/auth/login | Login + get token | Public |

### Tickets
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/tickets | Get all tickets | Admin, Agent |
| GET | /api/tickets/:id | Get one ticket | All |
| POST | /api/tickets | Create ticket | All |
| PUT | /api/tickets/:id | Update ticket | Admin, Agent |
| DELETE | /api/tickets/:id | Delete ticket | Admin |

### Departments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/departments | Get all | All |
| POST | /api/departments | Create | Admin |
| PUT | /api/departments/:id | Update | Admin |
| DELETE | /api/departments/:id | Delete | Admin |

### Categories
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/categories | Get all | All |
| POST | /api/categories | Create | Admin |
| PUT | /api/categories/:id | Update | Admin |
| DELETE | /api/categories/:id | Delete | Admin |

### Comments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/tickets/:id/comments | Get comments | All |
| POST | /api/tickets/:id/comments | Add comment | All |
| DELETE | /api/tickets/:id/comments/:id | Delete | Admin |

### Attachments
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | /api/tickets/:id/attachments | Get files | All |
| POST | /api/tickets/:id/attachments | Upload file | All |
| DELETE | /api/tickets/:id/attachments/:id | Delete | Admin |

---

## 👤 User Roles

| Role | Permissions |
|------|-------------|
| Admin | Full access |
| Agent | View + update tickets |
| User | Create + view own tickets |

---

## 🔒 Security Features

- JWT Authentication
- bcrypt Password Hashing
- Role Based Access Control
- Helmet Security Headers
- Rate Limiting
- Input Validation
- CORS Protection

---

## 👨‍💻 Developer

**Ashish Yadav** — Galgotias University
