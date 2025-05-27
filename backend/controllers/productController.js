const Product = require("../models/productModel");
const User = require("../models/userModel");
const asyncHandler = require("express-async-handler");

// @desc    Get all products
// @route   GET /api/products
// @access  Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  res.json(product);
});

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    brand,
    image,
    featured,
    warrantyPeriod,
  } = req.body;

  if (!name || !description || !price || !category || !brand) {
    res.status(400);
    throw new Error("Please include all required fields");
  }

  const product = await Product.create({
    user: req.user._id,
    name,
    description,
    price: Number(price),
    category,
    stock: Number(stock) || 0,
    brand,
    image: image || "/images/sample.jpg",
    featured: Boolean(featured),
    warrantyPeriod: Number(warrantyPeriod) || 0,
  });

  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { productsAdded: product._id } },
    { new: true }
  );

  res.status(201).json(product);
});

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    stock,
    brand,
    image,
    featured,
    warrantyPeriod,
  } = req.body;

  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  product.name = name || product.name;
  product.description = description || product.description;
  product.price = Number(price) || product.price;
  product.category = category || product.category;
  product.stock = Number(stock) ?? product.stock;
  product.brand = brand || product.brand;
  product.image = image || product.image;
  product.featured = Boolean(featured) ?? product.featured;
  product.warrantyPeriod = Number(warrantyPeriod) ?? product.warrantyPeriod;

  const updatedProduct = await product.save();
  res.json(updatedProduct);
});

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Try to remove the product ID from any user's productsAdded array
  const users = await User.find({ productsAdded: product._id.toString() });

  for (const user of users) {
    user.productsAdded = user.productsAdded.filter(
      (id) => id.toString() !== product._id.toString()
    );
    await user.save();
  }

  await product.deleteOne();

  res.json({
    message: "Product removed successfully and user data cleaned up",
  });
});

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
