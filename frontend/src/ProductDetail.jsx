import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import "./ProductDetail.css";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const getProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`
        );
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };
    getProduct();
  }, [id]);

  if (!product) return <p>Loading...</p>;

  return (
    <div className="product-detail">
      <img src={product.image} alt={product.name} />
      <div className="info">
        <h2>{product.name}</h2>
        <p className="category">Category: {product.category}</p>
        <p className="price">Price: ${product.price}</p>
        <p className="description">{product.description}</p>
        <p>
          <strong>Stock:</strong> {product.stock}
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
          {new Date(product.createdAt).toLocaleString()}
        </p>
        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(product.updatedAt).toLocaleString()}
        </p>

        <Link
          to="/dashboard"
          style={{ marginTop: "20px", display: "inline-block" }}
        >
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
};

export default ProductDetail;
