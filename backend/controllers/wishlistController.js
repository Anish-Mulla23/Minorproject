const User = require("../models/userModel");
const Product = require("../models/productModel"); // If you want to validate product existence

// ==================== ADD TO WISHLIST ====================
const addToWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { productId } = req.body;

    if (!user.wishlist.includes(productId)) {
      user.wishlist.push(productId);
      await user.save();
    }

    const populatedWishlist = await User.findById(req.user._id).populate(
      "wishlist"
    );
    res.json({ success: true, wishlist: populatedWishlist.wishlist });
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==================== REMOVE FROM WISHLIST ====================
const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.body.productId
    );
    await user.save();

    const populatedWishlist = await User.findById(req.user._id).populate(
      "wishlist"
    );
    res.json({ success: true, wishlist: populatedWishlist.wishlist });
  } catch (error) {
    console.error("Error in removeFromWishlist:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// ==================== GET WISHLIST ====================
const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ wishlist: user.wishlist });
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    res.status(500).json({ message: "Failed to fetch wishlist" });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
