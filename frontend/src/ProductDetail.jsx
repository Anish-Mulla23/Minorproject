import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        if (data) {
          setProduct(data);
        } else {
          setError("Product not found.");
        }
      } catch (error) {
        console.error("Error fetching product data:", error);
        setError("Failed to load product details. Please try again later.");
      }
    };

    getProduct();
  }, [id]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Please log in to add to cart.");
        return;
      }

      setLoading(true);

      await axios.post(
        "http://localhost:5000/api/cart/add", // Make sure your backend has this route
        { productId: id, quantity: 1 },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      alert("Product added to cart!");
      setLoading(false);
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Failed to add to cart. Please try again.");
      setLoading(false);
    }
  };

  const handleBuyNow = () => {
    // You can navigate to checkout page directly
    navigate(`/checkout/${id}`);
  };

  if (error) return <p>{error}</p>;
  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      <div className="product-detail-container">
        <img
          src={product.image || "fallback-image-url.jpg"}
          alt={product.name}
          className="product-image"
        />
        <div className="info">
          <h2 className="product-name">{product.name}</h2>
          <p className="category">Category: {product.category}</p>
          <p className="price">Price: ₹{product.price.toLocaleString()}</p>
          <p className="description">{product.description}</p>
          <p>
            <strong>Stock Available:</strong> {product.stock}
          </p>
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <p>
            <strong>Rating:</strong> ⭐ {product.rating} ({product.numReviews}{" "}
            reviews)
          </p>
          <p>
            <strong>Featured:</strong> {product.featured ? "Yes" : "No"}
          </p>
          <p>
            <strong>Warranty Period:</strong> {product.warrantyPeriod} months
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {new Date(product.createdAt).toLocaleDateString("en-IN")}
          </p>
          <p>
            <strong>Updated At:</strong>{" "}
            {new Date(product.updatedAt).toLocaleDateString("en-IN")}
          </p>

          {/* Buttons */}
          <div className="buttons">
            <button
              className="add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={loading}
            >
              {loading ? "Adding..." : "Add to Cart"}
            </button>

            <button
              className="buy-now-btn"
              onClick={handleBuyNow}
              style={{ marginLeft: "10px" }}
            >
              Buy Now
            </button>
          </div>

          <Link to="/dashboard" className="back-button">
            ← Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
