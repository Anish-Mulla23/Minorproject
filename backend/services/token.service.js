const jwt = require("jsonwebtoken");
const config = require("../config/config");
const Token = require("../models/Token");

const generateToken = (userId, expires, secret) => {
  return jwt.sign({ userId }, secret, { expiresIn: expires });
};

const generateAuthTokens = async (user) => {
  const accessToken = generateToken(
    user.id,
    config.JWT_ACCESS_EXPIRES_IN,
    config.JWT_SECRET
  );
  const refreshToken = generateToken(
    user.id,
    config.JWT_REFRESH_EXPIRES_IN,
    config.JWT_SECRET
  );

  await Token.create({ userId: user.id, token: refreshToken });

  return {
    access: {
      token: accessToken,
      expires: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes
    },
    refresh: {
      token: refreshToken,
      expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
    },
  };
};

const generateEmailToken = (email) => {
  return jwt.sign({ email }, config.JWT_EMAIL_SECRET, {
    expiresIn: config.JWT_EMAIL_EXPIRES_IN,
  });
};

const verifyToken = async (token, secret) => {
  return jwt.verify(token, secret);
};

module.exports = {
  generateAuthTokens,
  generateEmailToken,
  verifyToken,
};
