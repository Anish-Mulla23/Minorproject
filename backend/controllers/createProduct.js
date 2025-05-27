const Product = require("../models/productModel");
const User = require("../models/userModel");

// Controller to add a new product
const createProduct = async (req, res) => {
  try {
    const { name, description, price, category } = req.body;

    // 1. Create and save the new product
    const newProduct = new Product({
      name,
      description,
      price,
      category,
      addedBy: req.user._id, // Optional: store the user who added it
    });

    const savedProduct = await newProduct.save();

    // 2. Push product ID to the user's productsAdded array
    await User.findByIdAndUpdate(
      req.user._id,
      { $push: { productsAdded: savedProduct._id } },
      { new: true }
    );

    res.status(201).json(savedProduct);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: "Server error" });
  }
};
