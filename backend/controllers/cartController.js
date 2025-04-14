const User = require("../models/userModel");

const addToCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId } = req.body;

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity += 1;
    } else {
      user.cart.push({ product: productId, quantity: 1 });
    }

    await user.save();
    res.json({ success: true, cart: user.cart });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.body.productId
    );
    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    const { productId, quantity } = req.body;

    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      user.cart[itemIndex].quantity = quantity;
    }

    await user.save();
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("cart.product");
    res.json(user.cart);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

module.exports = {
  addToCart,
  removeFromCart,
  updateCartQuantity,
  getCart,
};
