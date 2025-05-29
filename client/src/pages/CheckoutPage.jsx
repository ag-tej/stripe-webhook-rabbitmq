import { useState } from "react";
import axios from "axios";
import CheckoutForm from "../components/CheckoutForm";

function CheckoutPage() {
  const [clientSecret, setClientSecret] = useState("");

  const handlePayNow = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/payment/create-intent",
        {
          amount: 2000,
          currency: "usd",
        }
      );
      setClientSecret(res.data.clientSecret);
    } catch (err) {
      console.error("Error creating PaymentIntent:", err);
    }
  };

  return (
    <div className="checkout-page">
      <h1>Stripe Checkout</h1>
      {!clientSecret ? (
        <button onClick={handlePayNow}>Pay Now</button>
      ) : (
        <CheckoutForm clientSecret={clientSecret} />
      )}
    </div>
  );
}

export default CheckoutPage;
