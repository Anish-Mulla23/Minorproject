import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./ProductDashboard.css";
import { FaHeart, FaShoppingCart, FaPlus, FaUser } from "react-icons/fa";

const ProductDashboard = () => {
  const [products, setProducts] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [token] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState({
    products: true,
    wishlist: false,
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

  // Fetch products, wishlist, and cart on mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch products
        const productsResponse = await axios.get(
          "http://localhost:5000/api/products"
        );
        setProducts(productsResponse.data);
        setLoading((prev) => ({ ...prev, products: false }));

        if (token) {
          // Fetch wishlist
          setLoading((prev) => ({ ...prev, wishlist: true }));
          const wishlistResponse = await axios.get(
            "http://localhost:5000/api/wishlist/",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const items = wishlistResponse.data?.wishlist || [];
          const wishlistIds = items.map((item) => item._id || item);
          setWishlist(wishlistIds);
          setLoading((prev) => ({ ...prev, wishlist: false }));

          // Fetch cart
          setLoading((prev) => ({ ...prev, cart: true }));
          const cartResponse = await axios.get(
            "http://localhost:5000/api/cart",
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );
          const cartItems = cartResponse.data || [];
          const cartIds = cartItems.map(
            (item) => item.product._id || item.product
          );
          setCart(cartIds);
          setLoading((prev) => ({ ...prev, cart: false }));
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.response?.data?.message || "Failed to load products");
        setLoading({ products: false, wishlist: false, cart: false });
      }
    };

    fetchData();
  }, [token]);

  // Wishlist toggle handler
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
        { headers: { Authorization: `Bearer ${token}` } }
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

  // Cart toggle handler: add or remove
  const handleCartChange = async (productId) => {
    if (!token) {
      alert("Please login to manage your cart.");
      navigate("/login");
      return;
    }

    try {
      setLoading((prev) => ({ ...prev, cart: true }));
      const isInCart = cart.includes(productId);

      if (isInCart) {
        // Remove from cart
        await axios.delete(`http://localhost:5000/api/cart/remove`, {
          data: { productId }, // DELETE with body needs axios config like this
          headers: { Authorization: `Bearer ${token}` },
        });
        setCart((prev) => prev.filter((id) => id !== productId));
        setSuccessMessage("Removed from cart");
      } else {
        // Add to cart
        await axios.post(
          "http://localhost:5000/api/cart/add",
          { productId, quantity: 1 },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setCart((prev) => [...prev, productId]);
        setSuccessMessage("Added to cart");
        window.location.reload();
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

  // Unique categories for filter dropdown
  const categories = ["all", ...new Set(products.map((p) => p.category))];

  if (loading.products) {
    return <div className="loading">Loading products...</div>;
  }

  // Helper to stop event bubbling on buttons so card onClick does not fire
  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <Link to="/Home" style={{ textDecoration: "none", color: "inherit" }}>
          <h1 className="logo">🛒 ShopEasy</h1>
        </Link>

        <div className="header-controls">
          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Search by name or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-bar"
            />
          </div>

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
            <button className="icon-btn">
              <FaHeart />
              Wishlist ({wishlist.length})
            </button>
          </Link>
          <Link to="/cart" style={{ textDecoration: "none" }}>
            <button className="icon-btn" title="Go to Cart">
              <FaShoppingCart style={{ marginRight: "5px" }} />
              Cart <span>({cart.length})</span>
            </button>
          </Link>

          <Link to="/AdminProductForm">
            <button className="icon-btn">
              <FaPlus />
              Add Product
            </button>
          </Link>

          <Link to="/profile">
            <button className="icon-btn">
              <FaUser />
              Profile
            </button>
          </Link>
        </div>
      </header>

      {error && <div className="error-message">{error}</div>}
      {successMessage && (
        <div className="success-message">{successMessage}</div>
      )}

      <main className="product-list">
        {filteredProducts.length === 0 ? (
          <p>No products found.</p>
        ) : (
          filteredProducts.map((product) => {
            const inWishlist = wishlist.includes(product._id);
            const inCart = cart.includes(product._id);

            // Click handler for product card - navigate to product details page
            const handleCardClick = () => {
              navigate(`/product/${product._id}`);
            };

            return (
              <div
                key={product._id}
                className="product-card"
                onClick={handleCardClick}
                style={{ cursor: "pointer" }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="product-image"
                />
                <h2>{product.name}</h2>
                <p>Category: {product.category}</p>
                <p>Price: ₹{product.price.toFixed(2)}</p>
                <p>Rating: {product.rating.toFixed(1)}</p>

                <div className="product-actions">
                  <button
                    className={`wishlist-btn ${inWishlist ? "active" : ""}`}
                    onClick={(e) => {
                      stopPropagation(e);
                      handleWishlistChange(product._id);
                    }}
                    disabled={loading.wishlist}
                    title={
                      inWishlist ? "Remove from wishlist" : "Add to wishlist"
                    }
                  >
                    <FaHeart />
                  </button>

                  <button
                    className={`cart-btn ${inCart ? "in-cart" : ""}`}
                    onClick={(e) => {
                      stopPropagation(e);
                      handleCartChange(product._id);
                    }}
                    disabled={loading.cart || product.stock === 0}
                    title={inCart ? "Remove from cart" : "Add to cart"}
                  >
                    <FaShoppingCart />
                    {loading.cart && (
                      <span className="loading-spinner">...</span>
                    )}
                  </button>
                </div>

                {product.stock === 0 && (
                  <p className="out-of-stock">Out of stock</p>
                )}
              </div>
            );
          })
        )}
      </main>
    </div>
  );
};

export default ProductDashboard;
