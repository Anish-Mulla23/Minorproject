import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import "./CartPage.css";
window.location.reload();

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [cartTotal, setCartTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");
  const config = {
    headers: { Authorization: `Bearer ${token}` },
  };

  const fetchCart = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/api/cart", config);
      setCart(res.data);
      setCartTotal(
        res.data.reduce(
          (acc, item) => acc + item.product.price * item.quantity,
          0
        )
      );
    } catch (err) {
      setError(err.response?.data?.message || "Error loading cart");
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (productId, quantity) => {
    try {
      await axios.put("/api/cart/update", { productId, quantity }, config);
      fetchCart();
    } catch (err) {
      setError("Failed to update item");
    }
  };

  const removeFromCart = async (productId) => {
    try {
      await axios.post("/api/cart/remove", { productId }, config);
      fetchCart();
    } catch (err) {
      setError("Failed to remove item");
    }
  };

  const clearError = () => setError("");

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <CartContext.Provider
      value={{
        cart,
        cartTotal,
        loading,
        error,
        removeFromCart,
        updateCartItem,
        clearError,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
