const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

// Generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// ==================== REGISTER ====================
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User registration failed" });
    }

    // Let the model's pre-save hook handle password hashing
    const user = await User.create({
      name,
      email,
      password, // Pass raw password, let model hash it
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id),
    });
  } catch (err) {
    console.error("Registration error:", err.message);
    res.status(500).json({ message: "User registration failed" });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: "Authentication failed" });
    }

    // Use the model's comparePassword method
    router.post("/login", async (req, res) => {
      const { email, password } = req.body;
      
      console.log("Login attempt for:", email); // Log the email attempting to login
    
      try {
        const user = await User.findOne({ email }).select("+password");
        
        if (!user) {
          console.log("User not found in database");
          return res.status(401).json({ message: "Authentication failed" });
        }
    
        console.log("Found user:", {
          id: user._id,
          email: user.email,
          passwordHash: user.password.substring(0, 20) + "..." // Log first 20 chars of hash
        });
    
        const isMatch = await user.comparePassword(password);
        console.log("Password comparison result:", isMatch); // Explicit match result
    
        if (!isMatch) {
          console.log("Password mismatch details:", {
            inputPasswordLength: password.length,
            storedHashLength: user.password.length
          });
          return res.status(401).json({ message: "Authentication failed" });
        }
    
        const token = generateToken(user._id);
        console.log("Generated token for user:", user._id);
        
        res.json({
          _id: user._id,
          name: user.name,
          email: user.email,
          token,
        });
      } catch (err) {
        console.error("Full login error:", {
          message: err.message,
          stack: err.stack
        });
        res.status(500).json({ message: "Authentication failed" });
      }
    });

module.exports = router;
