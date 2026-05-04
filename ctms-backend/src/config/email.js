const nodemailer = require('nodemailer')

// ========== CREATE TRANSPORTER ==========
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
})

// ========== SEND EMAIL FUNCTION ==========
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    }

    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent: ${info.messageId}`)
    return true

  } catch (error) {
    console.error(`❌ Email error: ${error.message}`)
    return false
  }
}

// ========== EMAIL TEMPLATES ==========

// Welcome email
const welcomeEmail = (name) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #2563eb;">Welcome to CTMS! 🎉</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your account has been created successfully!</p>
    <p>You can now:</p>
    <ul>
      <li>Create support tickets</li>
      <li>Track ticket status</li>
      <li>Add comments</li>
    </ul>
    <p>Thank you for joining CTMS!</p>
    <hr/>
    <p style="color: #666; font-size: 12px;">CTMS Support Team</p>
  </div>
`

// Ticket created email
const ticketCreatedEmail = (name, ticketId, title) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #2563eb;">Ticket Created Successfully! 🎫</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your ticket has been created successfully!</p>
    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
      <p><strong>Ticket ID:</strong> #${ticketId}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Status:</strong> Open</p>
    </div>
    <p>Our team will look into this shortly!</p>
    <hr/>
    <p style="color: #666; font-size: 12px;">CTMS Support Team</p>
  </div>
`

// Ticket resolved email
const ticketResolvedEmail = (name, ticketId, title) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #16a34a;">Ticket Resolved! ✅</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your ticket has been resolved!</p>
    <div style="background: #f0fdf4; padding: 15px; border-radius: 8px;">
      <p><strong>Ticket ID:</strong> #${ticketId}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Status:</strong> Resolved</p>
    </div>
    <p>Please let us know if you need further assistance!</p>
    <hr/>
    <p style="color: #666; font-size: 12px;">CTMS Support Team</p>
  </div>
`

module.exports = {
  sendEmail,
  welcomeEmail,
  ticketCreatedEmail,
  ticketResolvedEmail
}