require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGODB_URI: process.env.MONGO_URI,
  NODE_ENV: process.env.NODE_ENV,

  // Email
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: process.env.EMAIL_PASS,
  SENDGRID_API_KEY: process.env.SENDGRID_API_KEY,
  CLIENT_URL: process.env.CLIENT_URL,

  // JWT
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EMAIL_SECRET: process.env.JWT_EMAIL_SECRET,

  // Token expiration
  JWT_ACCESS_EXPIRES_IN: "30m",
  JWT_REFRESH_EXPIRES_IN: "7d",
  JWT_EMAIL_EXPIRES_IN: "15m",
};
