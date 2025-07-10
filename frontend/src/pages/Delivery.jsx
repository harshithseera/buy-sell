import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function Delivery() {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const [orders, setOrders] = useState([]);
  const [otpInputs, setOtpInputs] = useState({}); // holds OTP entered by seller for each order
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchOrdersToDeliver = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/orders/to-deliver`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOrders(res.data);
      } catch (error) {
        console.error("Error fetching orders to deliver:", error.response?.data || error.message);
      }
    };
    if (token) fetchOrdersToDeliver();
  }, [token]);

  // Seller clicks this button to generate a fresh OTP (which is supposed to be sent to the buyer via secure means)
  const handleGenerateOTP = async (orderId) => {
    console.log("Generating OTP for order:", orderId);
    try {
      const res = await axios.post(
        `${API_BASE_URL}/orders/generate-otp/${orderId}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("OTP generated and sent to buyer. (Check buyer's notifications)");
    } catch (error) {
      console.error("Error generating OTP:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || "Failed to generate OTP");
    }
  };

  // Seller enters the OTP they received from the buyer and clicks this button to complete the order.
  const handleCompleteOrder = async (orderId) => {
    try {
      const enteredOtp = otpInputs[orderId];
      if (!enteredOtp) {
        setErrorMessage("Please enter the OTP for this order.");
        return;
      }
      const res = await axios.patch(
        `${API_BASE_URL}/orders/complete/${orderId}`,
        { otp: enteredOtp },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Order completed successfully!");
      // Remove completed order from the list
      setOrders(orders.filter(order => order._id !== orderId));
      setOtpInputs(prev => ({ ...prev, [orderId]: "" }));
      setErrorMessage("");
    } catch (error) {
      console.error("Error completing order:", error.response?.data || error.message);
      setErrorMessage(error.response?.data?.error || "Failed to complete order. Check OTP.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Orders to Deliver</h2>
      {orders.length === 0 ? (
        <p>No pending deliveries.</p>
      ) : (
        orders.map(order => (
          <div key={order._id} className="border p-4 rounded mb-4">
            <p className="font-semibold">Order ID: {order._id}</p>
            <p>Total Price: ${order.totalPrice}</p>
            <p>
              Items:{" "}
              {order.items.map((item, idx) => (
                <span key={idx}>
                  {item.product.name} (${item.product.price}) x {item.quantity}
                  {idx < order.items.length - 1 ? ", " : ""}
                </span>
              ))}
            </p>
            <p>
              Buyer:{" "}
              {order.buyerId && order.buyerId.firstName
                ? `${order.buyerId.firstName} ${order.buyerId.lastName}`
                : order.buyerId}
            </p>
            <div className="mt-2">
              <button
                onClick={() => handleGenerateOTP(order._id)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Generate OTP for Closing Transaction
              </button>
            </div>
            <div className="mt-2">
              <input
                type="text"
                placeholder="Enter OTP received from buyer"
                value={otpInputs[order._id] || ""}
                onChange={(e) =>
                  setOtpInputs({ ...otpInputs, [order._id]: e.target.value })
                }
                className="border p-2 rounded w-full md:w-1/2"
              />
            </div>
            <button
              onClick={() => handleCompleteOrder(order._id)}
              className="bg-green-500 text-white px-4 py-2 rounded mt-2"
            >
              Complete Order
            </button>
            {errorMessage && <p className="text-red-500 mt-2">{errorMessage}</p>}
          </div>
        ))
      )}
    </div>
  );
}
