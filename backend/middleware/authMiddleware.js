const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const protect = async (req, res, next) => {
  try {
    // Check if Authorization header exists
    let token;

    // Check for the token in the Authorization header
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1]; // Extract token
    }

    if (!token) {
      return res
        .status(401)
        .json({ message: "No token, authorization denied" });
    }

    // Verify the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Find user from the decoded token (ignoring password)
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Attach user info to the request for later use (e.g., for authorization)
    req.user = user;

    // Optionally log the authenticated user (be careful not to log sensitive information)
    if (process.env.NODE_ENV !== "production") {
      console.log("Authenticated User:", req.user); // Only log in non-production environments
    }

    next(); // Continue to the next middleware or route handler
  } catch (error) {
    console.error("Token verification error:", error.message);
    res.status(401).json({ message: "Not authorized, token failed" });
  }
};

// Admin check (optional)
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); // Proceed to the next handler if user is admin
  } else {
    res.status(403).json({ message: "Not authorized as admin" });
  }
};

module.exports = { protect, admin };
