/* eslint-disable no-unused-vars */
import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    const cardElement = elements.getElement(CardElement);
    const { paymentIntent, error } = await stripe.confirmCardPayment("your_secret_key", {
      payment_method: { card: cardElement },
    });

    if (error) {
      setMessage(error.message);
    } else {
      setMessage("Payment successful! 🎉");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CardElement className="p-3 border rounded-lg" />
      <button className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-lg" disabled={!stripe}>
        Pay Now
      </button>
      {message && <p className="text-gray-700">{message}</p>}
    </form>
  );
};

const Payment = () => (
  <div className="bg-white p-6 shadow-lg rounded-lg w-full max-w-3xl">
    <h2 className="text-2xl font-bold text-gray-800 mb-4">Pay Your Bill</h2>
    <Elements stripe={stripePromise}>
      <CheckoutForm />
    </Elements>
  </div>
);

export default Payment;
