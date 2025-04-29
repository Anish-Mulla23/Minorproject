const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

// ==================== WISHLIST ROUTES ====================

// Add a product to wishlist
router.put("/add", protect, addToWishlist); // Updated to match the frontend

// Remove a product from wishlist
router.put("/remove", protect, removeFromWishlist);

// Get the user's wishlist
router.get("/", protect, getWishlist);

module.exports = router;
