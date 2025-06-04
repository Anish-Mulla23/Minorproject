const sgMail = require("@sendgrid/mail");
const config = require("../config/config");

sgMail.setApiKey(config.SENDGRID_API_KEY);

exports.sendOtpEmail = async (email, otp) => {
  const msg = {
    to: email,
    from: config.EMAIL_USER,
    subject: "Your OTP Code",
    html: `<p>Your verification code is: <strong>${otp}</strong></p>`,
  };
  await sgMail.send(msg);
};
