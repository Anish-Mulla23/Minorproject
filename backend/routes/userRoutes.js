const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const { protect } = require("../middleware/authMiddleware");
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
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = generateToken(user._id);

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (err) {
    res.status(500).json({ message: "Error registering user" });
  }
});

// ==================== LOGIN ====================
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = generateToken(user._id);

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (err) {
    res.status(500).json({ message: "Error logging in" });
  }
});

// ==================== WISHLIST ====================

// GET Wishlist
router.get("/wishlist", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json({ wishlist: user.wishlist.map((item) => item._id) });
  } catch (err) {
    res.status(500).json({ message: "Error fetching wishlist" });
  }
});

// ADD to Wishlist
router.put("/wishlist", protect, async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user._id);
    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }
    res.status(200).json({ message: "Added to wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Error updating wishlist" });
  }
});

// REMOVE from Wishlist
router.put("/wishlist/remove", protect, async (req, res) => {
  const { productId } = req.body;

  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
    await user.save();
    res.status(200).json({ message: "Removed from wishlist" });
  } catch (err) {
    res.status(500).json({ message: "Error removing from wishlist" });
  }
});

module.exports = router;
