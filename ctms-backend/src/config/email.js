const axios = require("axios");

const BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

// Parse "Name <email@example.com>" into { name, email }
const parseFromAddress = (fromString) => {
  const match = fromString?.match(/^(.*)<(.+)>$/);
  if (match) {
    return { name: match[1].trim().replace(/"/g, ""), email: match[2].trim() };
  }
  return { name: "CTMS Support", email: fromString || "no-reply@example.com" };
};

// ========== SEND EMAIL FUNCTION ==========
const sendEmail = async ({ to, subject, html }) => {
  try {
    if (!process.env.BREVO_API_KEY) {
      console.error("❌ Email error: BREVO_API_KEY not configured.");
      return false;
    }

    let finalTo = to;
    let finalSubject = subject;
    let finalHtml = html;

    if (process.env.EMAIL_OVERRIDE_TO) {
      const originalTo = to;
      finalTo = process.env.EMAIL_OVERRIDE_TO;
      finalSubject = `[ORIGINAL: ${originalTo}] ${subject}`;
      finalHtml = `${html}<hr/><p style="font-size:12px;color:#666;">Originally intended for: <strong>${originalTo}</strong></p>`;
    }

    const sender = parseFromAddress(process.env.EMAIL_FROM);

    const response = await axios.post(
      BREVO_API_URL,
      {
        sender,
        to: [{ email: finalTo }],
        subject: finalSubject,
        htmlContent: finalHtml,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      },
    );

    console.log(`✅ Email sent to ${finalTo}`, response.data?.messageId || "");
    return { success: true, info: response.data };
  } catch (error) {
    console.error(
      `❌ Email error: ${error.response?.data?.message || error.message}`,
    );
    return false;
  }
};

// ========== EMAIL TEMPLATES ==========

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
`;

const verificationEmail = (name, verificationLink) => `
<div style="font-family: Arial, sans-serif; max-width:600px; margin:auto; padding:20px;">
  <h2 style="color:#2563eb;">Verify Your Email</h2>
  <p>Hello <strong>${name}</strong>,</p>
  <p>Thank you for registering on CTMS.</p>
  <p>Please verify your email address by clicking the button below.</p>
  <div style="margin:30px 0;">
    
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
  <p>If you did not create this account, you can safely ignore this email.</p>
  <hr>
  <p style="font-size:12px;color:#777;">CTMS Support Team</p>
</div>
`;

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
`;

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
`;

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
`;

module.exports = {
  sendEmail,
  welcomeEmail,
  verificationEmail,
  ticketCreatedEmail,
  ticketResolvedEmail,
  ticketUpdatedEmail,
};
