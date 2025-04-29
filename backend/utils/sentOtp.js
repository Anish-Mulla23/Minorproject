const twilio = require("twilio");
const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
);

const sendOtp = async (phone, otp) => {
  try {
    const message = await client.messages.create({
      body: `Your OTP code is: ${otp}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phone, // Make sure it includes the country code (e.g., +91 for India)
    });
    return message;
  } catch (error) {
    console.error("Error sending OTP:", error);
    throw error;
  }
};

module.exports = sendOtp;
