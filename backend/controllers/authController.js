const User = require("../models/User");
const Token = require("../models/Token");
const {
  generateAuthTokens,
  generateEmailToken,
  verifyToken,
} = require("../services/token.service");
const { sendVerificationEmail } = require("../services/email.service");
const httpStatus = require("http-status");
const ApiError = require("../utils/ApiError");
const catchAsync = require("../utils/catchAsync");

const register = catchAsync(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  if (await User.findOne({ email })) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }

  // Create unverified user
  const user = await User.create({ name, email, password, isVerified: false });

  // Generate email verification token
  const emailToken = generateEmailToken(email);

  // Send verification email
  await sendVerificationEmail(user, emailToken);

  res.status(httpStatus.CREATED).json({
    status: "success",
    message: "Verification email sent",
    data: {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    },
  });
});

const verifyEmail = catchAsync(async (req, res) => {
  const { token } = req.query;

  try {
    // Verify token
    const decoded = await verifyToken(token, config.JWT_EMAIL_SECRET);
    const { email } = decoded;

    // Update user verification status
    const user = await User.findOneAndUpdate(
      { email, isVerified: false },
      { isVerified: true },
      { new: true }
    );

    if (!user) {
      throw new ApiError(
        httpStatus.BAD_REQUEST,
        "Email already verified or user not found"
      );
    }

    // Generate auth tokens
    const tokens = await generateAuthTokens(user);

    res.status(httpStatus.OK).json({
      status: "success",
      message: "Email verified successfully",
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
        tokens,
      },
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, "Email verification failed");
  }
});

module.exports = {
  register,
  verifyEmail,
};
