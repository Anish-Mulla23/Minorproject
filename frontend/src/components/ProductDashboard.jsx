import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Dashboard.css";

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [token] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState({
    products: true,
    wishlist: true,
    cart: false,
  });
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [sortOption, setSortOption] = useState("default");
  const [filterCategory, setFilterCategory] = useState("all");
  const navigate = useNavigate();

  // Clear messages after 3 seconds
  useEffect(() => {
    if (successMessage || error) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
        setError("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, error]);

  // Fetch products and wishlist on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get(
          "http://localhost:5000/api/products"
        );
        setProducts(productsResponse.data);
        setLoading((prev) => ({ ...prev, products: false }));

        // Fetch wishlist if token exists
        if (token) {
          const wishlistResponse = await axios.get(
            "http://localhost:5000/api/wishlist/",
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          // Handle both array of IDs and array of product objects
          const items = wishlistResponse.data?.wishlist || [];
          const wishlistIds = items.map((item) => item._id || item);
          setWishlist(wishlistIds);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load products");
      } finally {
        setLoading((prev) => ({ ...prev, wishlist: false }));
      }
    };

    fetchData();
  }, [token]);

  // Handle wishlist changes
  const handleWishlistChange = async (productId) => {
    if (!token) {
      alert("Please login to manage your wishlist.");
      navigate("/login");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, wishlist: true }));
      const isInWishlist = wishlist.includes(productId);

      const endpoint = isInWishlist ? "remove" : "add";
      const response = await axios.put(
        `http://localhost:5000/api/wishlist/${endpoint}`,
        { productId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.success) {
        setWishlist((prev) =>
          isInWishlist
            ? prev.filter((id) => id !== productId)
            : [...prev, productId]
        );
        setSuccessMessage(
          isInWishlist ? "Removed from wishlist" : "Added to wishlist"
        );
      }
    } catch (err) {
      console.error("Error updating wishlist:", err);
      setError(err.response?.data?.message || "Failed to update wishlist");
    } finally {
      setLoading((prev) => ({ ...prev, wishlist: false }));
    }
  };

  // Handle cart changes
  const handleCartChange = async (productId) => {
    if (!token) {
      alert("Please login to add items to cart.");
      navigate("/login");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, cart: true }));
      const isInCart = cart.includes(productId);

      if (isInCart) {
        // Remove from cart
        await axios.delete(`http://localhost:5000/api/cart/${productId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart((prev) => prev.filter((id) => id !== productId));
        setSuccessMessage("Removed from cart");
      } else {
        // Add to cart
        await axios.post(
          "http://localhost:5000/api/cart",
          { productId, quantity: 1 },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setCart((prev) => [...prev, productId]);
        setSuccessMessage("Added to cart");
      }
    } catch (err) {
      console.error("Error updating cart:", err);
      setError(err.response?.data?.message || "Failed to update cart");
    } finally {
      setLoading((prev) => ({ ...prev, cart: false }));
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      const matchesSearch =
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory =
        filterCategory === "all" || product.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortOption) {
        case "price-asc":
          return a.price - b.price;
        case "price-desc":
          return b.price - a.price;
        case "rating":
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  // Get unique categories for filter
  const categories = [
    "all",
    ...new Set(products.map((product) => product.category)),
  ];

  if (loading.products) {
    return <div className="loading">Loading products...</div>;
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>My Shop</h1>
        <div className="header-controls">
          <input
            type="text"
            placeholder="Search by name or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-bar"
          />
          <div className="sort-filter-container">
            <select
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
              className="sort-select"
            >
              <option value="default">Default</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="filter-select"
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category.charAt(0).toUpperCase() + category.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="header-actions">
          <Link to="/wishlist">
            <button className="wishlist-btn">
              Wishlist ({wishlist.length})
            </button>
          </Link>
          <Link to="/cart">
            <button className="cart-btn">Cart ({cart.length})</button>
          </Link>
          <Link to="/profile">
            <button className="profile-btn">Profile</button>
          </Link>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <h2 className="dashboard-title">Product Dashboard</h2>

      <div className="product-grid">
        {filteredProducts.length > 0 ? (
          filteredProducts.map((product) => (
            <div className="product-card" key={product._id}>
              <Link to={`/product/${product._id}`}>
                <div className="product-image-container">
                  <img
                    src={product.image || "https://via.placeholder.com/300x200"}
                    alt={product.name}
                    className="product-image"
                  />
                  {product.stock <= 0 && (
                    <div className="out-of-stock-badge">Out of Stock</div>
                  )}
                </div>
                <h3>{product.name}</h3>
                <p className="category">{product.category}</p>
                <p className="price">
                  {product.price.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                  })}
                </p>
                <div className="details">
                  <span>⭐ {product.rating || "No ratings"}</span>
                  <span>Stock: {product.stock}</span>
                </div>
              </Link>
              <div className="actions">
                <button
                  className={`wishlist-btn ${
                    wishlist.includes(product._id) ? "active" : ""
                  }`}
                  onClick={() => handleWishlistChange(product._id)}
                  disabled={loading.wishlist}
                >
                  {wishlist.includes(product._id)
                    ? "❤️ Wishlist"
                    : "♡ Wishlist"}
                </button>
                <button
                  className={`cart-btn ${
                    cart.includes(product._id) ? "active" : ""
                  }`}
                  onClick={() => handleCartChange(product._id)}
                  disabled={loading.cart || product.stock <= 0}
                >
                  {cart.includes(product._id) ? "✔️ In Cart" : "🛒 Add to Cart"}
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="no-products">
            <p>No products found matching your criteria.</p>
            <button
              onClick={() => {
                setSearchQuery("");
                setFilterCategory("all");
                setSortOption("default");
              }}
              className="reset-filters-btn"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDashboard;
