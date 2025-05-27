const express = require("express");
const {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCart,
} = require("../controllers/cartController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add", protect, addToCart); // POST /api/cart/add
router.post("/remove", protect, removeFromCart); // POST /api/cart/remove
router.post("/update", protect, updateCartQuantity); // POST /api/cart/update
router.get("/", protect, getCart); // GET  /api/cart/

module.exports = router;
