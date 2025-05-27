import React, { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

const CartPage = () => {
  const {
    cart,
    cartTotal,
    loading,
    error,
    removeFromCart,
    updateCartItem,
    clearError,
  } = useCart();

  // Debug cart data on every render
  useEffect(() => {
    console.log("Cart data:", cart);
  }, [cart]);

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItem(productId, newQuantity);
  };

  if (loading && cart.length === 0) {
    return <div className="loading">Loading cart...</div>;
  }

  if (error) {
    return (
      <div className="error">
        {error}
        <button onClick={clearError}>Dismiss</button>
      </div>
    );
  }

  return (
    <div className="cart-container">
      <h1>Shopping Cart</h1>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/products" className="btn">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => {
              // Defensive check: if product info missing, skip rendering this item
              if (!item.product) return null;

              const { _id, image, name, price } = item.product;
              return (
                <div key={_id} className="cart-item">
                  <div className="item-image">
                    <img src={image} alt={name} />
                  </div>
                  <div className="item-details">
                    <h3>{name}</h3>
                    <p>${price.toFixed(2)}</p>
                    <div className="quantity-control">
                      <button
                        onClick={() =>
                          handleQuantityChange(_id, item.quantity - 1)
                        }
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        onClick={() =>
                          handleQuantityChange(_id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => removeFromCart(_id)}
                      className="remove-btn"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="item-total">
                    ${(price * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Order Summary</h2>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>${Number(cartTotal).toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <div className="summary-row total">
              <span>Total</span>
              <span>${Number(cartTotal).toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="btn checkout-btn">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
