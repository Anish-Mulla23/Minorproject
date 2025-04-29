const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  let token;

  // Check if the token is present in the Authorization header or cookies
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ message: "Not authorized, no token" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from the decoded token's ID
    const user = await User.findById(decoded.id).select("-password -__v");

    if (!user) {
      return res.status(401).json({ message: "User no longer exists" });
    }

    req.user = user; // Attach user to request object for later use
    next();
  } catch (error) {
    let message = "Not authorized, token failed";
    if (error.name === "TokenExpiredError") {
      message = "Session expired. Please log in again";
    } else if (error.name === "JsonWebTokenError") {
      message = "Invalid token";
    }

    console.error("Authentication error:", error.message);
    res.status(401).json({ message });
  }
};

const admin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    return next(); // Proceed to next middleware if user is admin
  }
  res.status(403).json({ message: "Admin access required" }); // Return 403 if user is not an admin
};

module.exports = { protect, admin };
