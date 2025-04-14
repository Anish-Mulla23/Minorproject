const express = require("express");
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");
const { protect, admin } = require("../middleware/authMiddleware");

// Verify all handlers are functions before attaching routes
const validateHandler = (handler, name) => {
  if (typeof handler !== "function") {
    throw new TypeError(`Handler ${name} is not a function`);
  }
};

// Validate all controllers
validateHandler(getProducts, "getProducts");
validateHandler(getProductById, "getProductById");
validateHandler(createProduct, "createProduct");
validateHandler(updateProduct, "updateProduct");
validateHandler(deleteProduct, "deleteProduct");

// Validate middleware
validateHandler(protect, "protect");
validateHandler(admin, "admin");

// Routes
router.route("/").get(getProducts).post(protect, admin, createProduct);

router
  .route("/:id")
  .get(getProductById)
  .put(protect, admin, updateProduct)
  .delete(protect, admin, deleteProduct);

module.exports = router;
