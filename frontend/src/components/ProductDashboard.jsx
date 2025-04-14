import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "./Dashboard.css";

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  // const { token } = response.data.token;
  // localStorage.setItem("token", token); // Store token in localStorage
  const [token] = useState(localStorage.getItem("token")); // Store the token in state
  console.log(token);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get("http://localhost:5000/api/products");
        setProducts(data);
      } catch (err) {
        console.error("Error fetching products:", err);
      }
    };

    // Fetch products and the user's wishlist (if token is available)
    const fetchWishlist = async () => {
      if (token) {
        try {
          const { data } = await axios.get(
            "http://localhost:5000/api/users/wishlist",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setWishlist(data.wishlist || []);
        } catch (err) {
          console.error("Error fetching wishlist:", err);
        }
      }
    };

    fetchProducts();
    fetchWishlist(); // Fetch wishlist if token exists
  }, [token]); // Re-run when the token changes

  const toggleWishlist = async (productId) => {
    if (token) {
      try {
        if (wishlist.includes(productId)) {
          // Remove from wishlist
          await axios.put(
            "http://localhost:5000/api/users/wishlist/remove",
            { productId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setWishlist((prev) => prev.filter((id) => id !== productId));
        } else {
          // Add to wishlist
          await axios.put(
            "http://localhost:5000/api/users/wishlist",
            { productId },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setWishlist((prev) => [...prev, productId]);
        }
      } catch (err) {
        console.error("Error updating wishlist:", err);
      }
    } else {
      console.log("Please login to manage your wishlist.");
    }
  };

  const toggleCart = (productId) => {
    setCart((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  return (
    <div className="dashboard">
      <h2 className="dashboard-title">Product Dashboard</h2>
      <div className="wishlist-button">
        <Link to="/wishlist">
          <button className="wishlist-btn">Go to Wishlist</button>
        </Link>
      </div>
      <div className="product-grid">
        {products.map((product) => (
          <div className="product-card" key={product._id}>
            <Link to={`/product/${product._id}`}>
              <img
                src={product.image || "https://via.placeholder.com/300x200"}
                alt={product.name}
              />
              <h3>{product.name}</h3>
              <p className="category">{product.category}</p>
              <p className="price">${product.price}</p>
              <div className="details">
                <span>⭐ {product.rating}</span>
                <span>Stock: {product.stock}</span>
              </div>
            </Link>
            <div className="actions">
              <label>
                <input
                  type="checkbox"
                  checked={wishlist.includes(product._id)}
                  onChange={() => toggleWishlist(product._id)}
                />{" "}
                Wishlist
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={cart.includes(product._id)}
                  onChange={() => toggleCart(product._id)}
                />{" "}
                Cart
              </label>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDashboard;
