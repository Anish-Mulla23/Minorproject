import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Wishlist.css";

const Wishlist = () => {
  const [wishlistProducts, setWishlistProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState({});
  const [addingToCart, setAddingToCart] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Clear success message after 3 seconds
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  const fetchWishlist = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to view your wishlist.");
        setLoading(false);
        navigate("/login");
        return;
      }

      const response = await axios.get("http://localhost:5000/api/wishlist/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const wishlistItems = response.data?.wishlist || [];
      let products = [];

      if (wishlistItems.length > 0) {
        if (typeof wishlistItems[0] === "object" && wishlistItems[0]._id) {
          // Backend returns full products
          products = wishlistItems.map((item) => ({
            ...item,
            inWishlist: true,
          }));
        } else {
          // Backend returns IDs - fetch product details
          const productDetails = await Promise.all(
            wishlistItems.map(async (productId) => {
              try {
                const res = await axios.get(
                  `http://localhost:5000/api/products/${productId}`
                );
                return { ...(res.data.product || res.data), inWishlist: true };
              } catch (error) {
                console.error(`Failed to fetch product ${productId}:`, error);
                return null;
              }
            })
          );
          products = productDetails.filter(Boolean);
        }
      }

      setWishlistProducts(products);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      setError(
        err.response?.data?.message ||
          err.message ||
          "Failed to fetch wishlist. Please try again."
      );
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  const removeFromWishlist = async (productId) => {
    try {
      setRemoving((prev) => ({ ...prev, [productId]: true }));
      const token = localStorage.getItem("token");

      // Optimistic UI update
      setWishlistProducts((prev) =>
        prev.filter((item) => item._id !== productId)
      );

      await axios.put(
        "http://localhost:5000/api/wishlist/remove",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Item removed from wishlist");
    } catch (err) {
      console.error("Error removing from wishlist:", err);
      setError(
        err.response?.data?.message ||
          "Failed to remove item. Please try again."
      );
      // Re-fetch to ensure consistency
      fetchWishlist();
    } finally {
      setRemoving((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const addToCart = async (productId) => {
    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      const token = localStorage.getItem("token");

      await axios.post(
        "http://localhost:5000/api/cart/",
        { productId, quantity: 1 },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Item added to cart successfully");
    } catch (err) {
      console.error("Error adding to cart:", err);
      setError(
        err.response?.data?.message ||
          "Failed to add item to cart. Please try again."
      );
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  const moveToCart = async (productId) => {
    try {
      setAddingToCart((prev) => ({ ...prev, [productId]: true }));
      const token = localStorage.getItem("token");

      // Optimistic UI update
      setWishlistProducts((prev) =>
        prev.filter((item) => item._id !== productId)
      );

      // Remove from wishlist
      await axios.put(
        "http://localhost:5000/api/wishlist/remove",
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSuccessMessage("Item moved to cart successfully");
    } catch (err) {
      console.error("Error moving to cart:", err);
      setError(
        err.response?.data?.message ||
          "Failed to move item to cart. Please try again."
      );
      // Re-fetch to ensure consistency
      fetchWishlist();
      if (err.response?.status === 401) {
        navigate("/login");
      }
    } finally {
      setAddingToCart((prev) => ({ ...prev, [productId]: false }));
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  const handleProductClick = (productId, e) => {
    // Prevent navigation if clicking on buttons
    if (e.target.closest(".wishlist-action-btn")) return;
    navigate(`/product/${productId}`);
  };

  if (loading) return <div className="loading">Loading wishlist...</div>;
  if (error)
    return (
      <div className="error-message">
        {error}
        <div>
          <button onClick={fetchWishlist} className="retry-btn">
            Retry
          </button>
          {error.includes("logged in") && (
            <button onClick={() => navigate("/login")} className="login-btn">
              Login
            </button>
          )}
        </div>
      </div>
    );

  return (
    <div className="wishlist-container">
      <button className="go-back-button" onClick={() => window.history.back()}>
        ← Go Back
      </button>
      <h2>My Wishlist</h2>

      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      {wishlistProducts.length === 0 && !loading ? (
        <div className="empty-wishlist">
          <p>Your wishlist is empty.</p>
          <button onClick={() => navigate("/dashboard")} className="browse-btn">
            Browse Products
          </button>
        </div>
      ) : (
        <>
          <div className="wishlist-summary">
            <p>
              {wishlistProducts.length}{" "}
              {wishlistProducts.length === 1 ? "item" : "items"} in wishlist
            </p>
            <button
              onClick={() => navigate("/Dashboard")}
              className="continue-shopping-btn"
            >
              Continue Shopping
            </button>
          </div>

          <ul className="wishlist-items">
            {wishlistProducts.map((item) => (
              <li
                key={item._id}
                className="wishlist-item"
                onClick={(e) => handleProductClick(item._id, e)}
              >
                <div className="wishlist-item-image">
                  <img
                    src={item.image || "/placeholder-image.jpg"}
                    alt={item.name}
                    onError={(e) => {
                      e.target.src = "/placeholder-image.jpg";
                    }}
                  />
                </div>

                <div className="wishlist-item-details">
                  <h4>{item.name}</h4>
                  <p className="description">
                    {item.description?.substring(0, 100)}...
                  </p>
                  <div className="price-stock">
                    <p className="price">₹{item.price?.toFixed(2)}</p>
                    {item.stock > 0 ? (
                      <span className="in-stock">In Stock</span>
                    ) : (
                      <span className="out-of-stock">Out of Stock</span>
                    )}
                  </div>

                  <div className="wishlist-actions">
                    <button
                      className="wishlist-action-btn add-to-cart-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart(item._id);
                      }}
                      disabled={addingToCart[item._id] || item.stock <= 0}
                    >
                      {addingToCart[item._id] ? "Adding..." : "Add to Cart"}
                    </button>

                    <button
                      className="wishlist-action-btn remove-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromWishlist(item._id);
                      }}
                      disabled={removing[item._id]}
                    >
                      {removing[item._id] ? "Removing..." : "Remove"}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default Wishlist;
