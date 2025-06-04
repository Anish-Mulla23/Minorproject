import React, { useState } from "react";
import "./BuyNowPage.css"; // ✅ make sure this path is correct

const BuyNowPage = () => {
  const [orderConfirmed, setOrderConfirmed] = useState(false);
  const [onlineNotAvailable, setOnlineNotAvailable] = useState(false);

  const handleCOD = () => {
    setOnlineNotAvailable(false);
    setTimeout(() => {
      setOrderConfirmed(true);
    }, 1000);
  };

  const handleOnlinePayment = () => {
    setOrderConfirmed(false);
    setOnlineNotAvailable(true);
  };

  return (
    <div className="buy-now-container">
      {!orderConfirmed ? (
        <div className="card">
          <h2>Choose Payment Method</h2>
          <p>Currently, only Cash on Delivery is available.</p>

          <button onClick={handleCOD} className="button cod">
            Confirm Order (Cash on Delivery)
          </button>

          <button onClick={handleOnlinePayment} className="button online">
            Pay Online
          </button>

          {onlineNotAvailable && (
            <p className="warning">
              Online payment is not available at the moment.
            </p>
          )}
        </div>
      ) : (
        <div className="card">
          <h2 className="text-green-600">Order Confirmed!</h2>
          <p>
            Thank you for your order. You chose{" "}
            <strong>Cash on Delivery</strong>. Your order will be delivered
            soon.
          </p>
        </div>
      )}
    </div>
  );
};

export default BuyNowPage;
