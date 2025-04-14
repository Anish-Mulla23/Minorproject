const Product = require("../models/productModel");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const products = await Product.find({});
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: "Error fetching products" });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error fetching product" });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    brand,
    image,
    rating,
    numReviews,
    featured,
    warrantyPeriod,
  } = req.body;

  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name || product.name;
      product.description = description || product.description;
      product.price = price || product.price;
      product.category = category || product.category;
      product.stock = stock ?? product.stock;
      product.brand = brand || product.brand;
      product.image = image || product.image;
      product.rating = rating || product.rating;
      product.numReviews = numReviews || product.numReviews;
      product.featured = featured ?? product.featured;
      product.warrantyPeriod = warrantyPeriod ?? product.warrantyPeriod;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res.status(500).json({ message: "Failed to update product" });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.deleteOne();
      res.json({ message: "Product removed" });
    } else {
      res.status(404).json({ message: "Product not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting product" });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      category,
      stock,
      brand,
      image,
      rating,
      numReviews,
      featured,
      warrantyPeriod,
    } = req.body;

    // Validate required fields
    if (!name || !description || !price || !category || !brand) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a new product
    const product = new Product({
      name,
      description,
      price,
      category,
      stock: stock || 0,
      brand,
      image: image || "https://example.com/default-image.jpg", // Default image URL
      rating: rating || 0, // Default to 0 if not provided
      numReviews: numReviews || 0, // Default to 0 if not provided
      featured: featured ?? false, // Default to false if not provided
      warrantyPeriod: warrantyPeriod || 0, // Default to 0 if not provided
    });

    const savedProduct = await product.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Create product error:", error);
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: "Validation failed",
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    res.status(500).json({ message: "Failed to create product" });
  }
};

// ✅ Export all controller functions
module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
