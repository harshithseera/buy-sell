import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Place an order
export const placeOrder = async (token) => {
  if (!token) throw new Error("No token provided");
  const res = await axios.post(`${API_BASE_URL}/orders/place`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Complete an order with OTP
export const completeOrder = async (token, orderId, otp) => {
  if (!token) throw new Error("No token provided");
  const res = await axios.post(`${API_BASE_URL}/orders/complete`, { orderId, enteredOTP: otp }, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
