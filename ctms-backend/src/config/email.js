const nodemailer = require('nodemailer')

// ========== CREATE TRANSPORTER ==========
let transporter
let usingTestAccount = false

const initTransporter = async () => {
  if (!process.env.EMAIL_HOST || !process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    // No SMTP configured — create Ethereal test account for development
    try {
      const testAccount = await nodemailer.createTestAccount()
      transporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      })
      usingTestAccount = true
      console.warn('⚠️ No SMTP creds found — using Ethereal test account for development. Preview URLs will be logged.')
    } catch (err) {
      console.error('Failed to create test email account:', err.message)
      throw err
    }
  } else {
    transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    })
  }
}

// Initialize transporter in background
initTransporter().catch(err => console.error('Email transporter init error:', err))

// ========== SEND EMAIL FUNCTION ==========
const sendEmail = async ({ to, subject, html }) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html
    }

    // If EMAIL_OVERRIDE_TO is set, route all outgoing mail to that address
    if (process.env.EMAIL_OVERRIDE_TO) {
      const originalTo = mailOptions.to
      mailOptions.to = process.env.EMAIL_OVERRIDE_TO
      // append original recipient info to the subject and body for clarity
      mailOptions.subject = `[ORIGINAL: ${originalTo}] ${mailOptions.subject}`
      mailOptions.html = `${mailOptions.html}<hr/><p style="font-size:12px;color:#666;">Originally intended for: <strong>${originalTo}</strong></p>`
      if (process.env.EMAIL_OVERRIDE_BCC === 'true') {
        mailOptions.bcc = originalTo
      }
    }

    if (!transporter) await initTransporter()
    const info = await transporter.sendMail(mailOptions)
    console.log(`✅ Email sent: ${info.messageId} to ${mailOptions.to}`)
    if (info.envelope) {
      console.log(`📩 Envelope: ${JSON.stringify(info.envelope)}`)
    }

    if (usingTestAccount) {
      const preview = nodemailer.getTestMessageUrl(info)
      console.log('🔎 Preview URL:', preview)
      return { success: true, preview, info }
    }

    return { success: true, info }

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
const verificationEmail = (name, verificationLink) => `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
  <h2 style="color:#2563eb;">Verify Your Email</h2>

  <p>Hello <strong>${name}</strong>,</p>

  <p>
    Thank you for registering on CTMS.
  </p>

  <p>
    Please verify your email address by clicking the button below.
  </p>

  <div style="margin:30px 0;">
    <a
      href="${verificationLink}"
      style="
        background:#2563eb;
        color:#fff;
        padding:14px 24px;
        text-decoration:none;
        border-radius:8px;
        display:inline-block;
        font-weight:bold;
      "
    >
      Verify Email
    </a>
  </div>

  <p>
    If you did not create this account, you can safely ignore this email.
  </p>

  <hr>

  <p style="font-size:12px;color:#777;">
    CTMS Support Team
  </p>
</div>
`;

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

// Ticket updated (generic) email
const ticketUpdatedEmail = (name, ticketId, title, status) => `
  <div style="font-family: Arial, sans-serif; padding: 20px;">
    <h2 style="color: #2563eb;">Ticket Update Notification</h2>
    <p>Hello <strong>${name}</strong>,</p>
    <p>Your ticket has been updated.</p>
    <div style="background: #f3f4f6; padding: 15px; border-radius: 8px;">
      <p><strong>Ticket ID:</strong> #${ticketId}</p>
      <p><strong>Title:</strong> ${title}</p>
      <p><strong>Current Status:</strong> ${status}</p>
    </div>
    <p>Visit the portal to view more details or add comments.</p>
    <hr/>
    <p style="color: #666; font-size: 12px;">CTMS Support Team</p>
  </div>
`

module.exports = {
  sendEmail,
  welcomeEmail,
  verificationEmail,
  ticketCreatedEmail,
  ticketResolvedEmail,
  ticketUpdatedEmail,
};