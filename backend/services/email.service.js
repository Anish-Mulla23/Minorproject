const nodemailer = require("nodemailer");
const config = require("../config/config");
const logger = require("../utils/logger");

let transporter;

if (config.SENDGRID_API_KEY) {
  transporter = nodemailer.createTransport({
    service: "SendGrid",
    auth: {
      user: "apikey",
      pass: config.SENDGRID_API_KEY,
    },
  });
} else {
  transporter = nodemailer.createTransport({
    service: config.EMAIL_SERVICE || "gmail",
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASS,
    },
  });
}

const sendEmail = async (to, subject, html) => {
  try {
    const mailOptions = {
      from: `"E-Commerce App" <${config.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    await transporter.sendMail(mailOptions);
    logger.info(`Email sent to ${to}`);
  } catch (error) {
    logger.error(`Error sending email to ${to}: ${error.message}`);
    throw new Error("Failed to send email");
  }
};

const sendVerificationEmail = async (user, verificationToken) => {
  const verificationUrl = `${config.CLIENT_URL}/verify-email?token=${verificationToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #4CAF50;">Email Verification</h2>
      <p>Hello ${user.name},</p>
      <p>Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}" 
         style="display: inline-block; padding: 10px 20px; background: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">
        Verify Email
      </a>
      <p>This link will expire in 15 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr>
      <p style="font-size: 12px; color: #777;">© ${new Date().getFullYear()} E-Commerce App. All rights reserved.</p>
    </div>
  `;

  await sendEmail(user.email, "Verify Your Email", html);
};

module.exports = {
  sendVerificationEmail,
};
