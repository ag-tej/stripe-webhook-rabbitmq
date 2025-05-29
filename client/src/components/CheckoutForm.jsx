import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useState } from "react";

const CheckoutForm = ({ clientSecret }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setStatus("processing");
    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });
    if (result.error) {
      setStatus("error");
      console.error(result.error.message);
    } else if (result.paymentIntent.status === "succeeded") {
      setStatus("success");
      console.log("Payment succeeded!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement />
      <button type="submit" disabled={!stripe || status === "processing"}>
        Pay
      </button>
      {status === "success" && <p>Payment Successful!</p>}
      {status === "error" && <p>Payment Failed</p>}
    </form>
  );
};

export default CheckoutForm;
