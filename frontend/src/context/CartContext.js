import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch cart data from backend on mount
  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        if (!token) {
          setCart([]);
          setCartTotal(0);
          setLoading(false);
          return;
        }
        const response = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const cartItems = response.data || [];
        setCart(cartItems);

        const total = cartItems.reduce(
          (sum, item) => sum + item.product.price * item.quantity,
          0
        );
        setCartTotal(total.toFixed(2));
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load cart");
      } finally {
        setLoading(false);
      }
    };
    fetchCart();
  }, [token]);

  const addToCart = async (productId, quantity = 1) => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/cart/add",
        { productId, quantity },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const addedItem = response.data;

      // Check if item already exists in cart
      const exists = cart.find((item) => item.product._id === productId);

      let updatedCart;
      if (exists) {
        updatedCart = cart.map((item) =>
          item.product._id === productId
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        updatedCart = [...cart, addedItem];
      }

      setCart(updatedCart);

      const newTotal = updatedCart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setCartTotal(newTotal.toFixed(2));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to add to cart");
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/update",
        { productId, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const updatedCart = cart.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      setCart(updatedCart);

      const newTotal = updatedCart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setCartTotal(newTotal.toFixed(2));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update cart");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.post(
        "http://localhost:5000/api/cart/remove",
        { productId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const updatedCart = cart.filter((item) => item.product._id !== productId);
      setCart(updatedCart);

      const updatedTotal = updatedCart.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
      );
      setCartTotal(updatedTotal.toFixed(2));
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to remove item");
    }
  };

  const clearError = () => setError("");

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        loading,
        error,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
