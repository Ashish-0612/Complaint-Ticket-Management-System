const multer = require('multer')
const path = require('path')

// ========== STORAGE CONFIG ==========
const storage = multer.diskStorage({

  // Where to save files
  destination: (req, file, cb) => {
    cb(null, 'uploads/tickets/')
  },

  // What to name the file
  filename: (req, file, cb) => {
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1000)}${path.extname(file.originalname)}`
    cb(null, uniqueName)
  }
})

// ========== FILE FILTER ==========
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = /jpeg|jpg|png|gif|pdf|doc|docx/;

  // Check extension
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase()
  )

  // Check mime type
  const mimetype = allowedTypes.test(file.mimetype)

  if (extname && mimetype) {
    cb(null, true)   // accept file ✅
  } else {
    cb(new Error('Only images and documents allowed!'), false)  // reject! ❌
  }
}

// ========== MULTER INSTANCE ==========
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024  // max 5MB
  },
  fileFilter: fileFilter
})

module.exports = upload;