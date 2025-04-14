const User = require("../models/userModel");

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

    res.json({ success: true, wishlist: user.wishlist });
  } catch (error) {
    console.error("Error in addToWishlist:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.body.productId
    );
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("wishlist");
    res.json(user.wishlist);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  addToWishlist,
  removeFromWishlist,
  getWishlist,
};
