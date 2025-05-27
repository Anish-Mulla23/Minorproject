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

// Optional: Handler validation (can be removed if you trust your imports)
const validateHandler = (handler, name) => {
  if (typeof handler !== "function") {
    throw new TypeError(`Handler ${name} is not a function`);
  }
};

// Validate all controllers (optional)
[
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
].forEach((handler, i) =>
  validateHandler(
    handler,
    Object.keys({
      getProducts,
      getProductById,
      createProduct,
      updateProduct,
      deleteProduct,
    })[i]
  )
);

// Validate middleware (optional)
[protect, admin].forEach((handler, i) =>
  validateHandler(handler, Object.keys({ protect, admin })[i])
);

// Routes
router
  .route("/")
  .get(getProducts) // Public route: get all products
  .post(protect, admin, createProduct); // Admin route: create product

router
  .route("/:id")
  .get(getProductById) // Public route: get product by ID
  .put(protect, admin, updateProduct) // Admin route: update product
  .delete(protect, admin, deleteProduct); // Admin route: delete product

module.exports = router;
