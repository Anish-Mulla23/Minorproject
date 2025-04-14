const express = require("express");
const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addToCart);
router.post("/remove", protect, removeFromCart);
router.post("/update", protect, updateCartQuantity);
router.get("/", protect, getCart);

module.exports = router;
