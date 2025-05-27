const User = require("../models/userModel");

const addToCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.json({ success: true, cart: updatedUser.cart });
  } catch (error) {
    console.error("Add to cart error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );

    await user.save();

    const updatedUser = await User.findById(req.user._id).populate(
      "cart.product"
    );

    res.json({ success: true, cart: updatedUser.cart });
  } catch (error) {
    console.error("Remove from cart error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) return res.status(404).json({ message: "User not found" });

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity;
      await user.save();

      const updatedUser = await User.findById(req.user._id).populate(
        "cart.product"
      );

      res.json({ success: true, cart: updatedUser.cart });
    } else {
      res.status(404).json({ message: "Product not found in cart" });
    }
  } catch (error) {
    console.error("Update cart quantity error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user.cart);
  } catch (error) {
    console.error("Get cart error:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCart,
};
