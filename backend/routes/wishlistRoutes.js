const express = require("express");
const {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
} = require("../controllers/wishlistController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addToWishlist);
router.post("/remove", protect, removeFromWishlist);
router.get("/", protect, getWishlist);

module.exports = router;
