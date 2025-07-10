// frontend/api/cart.js
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const BASE_URL = `${API_BASE_URL}/cart`;

// Fetch the persistent cart for a user given their token
export const fetchCart = async (token) => {
  console.log(`token: ${token}`);
  if (!token) throw new Error("No token provided");
  const res = await axios.get(BASE_URL, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Add a product to the cart
export const addToCart = async (token, productId, quantity = 1) => {
  if (!token) throw new Error("No token provided");
  const res = await axios.post(
    `${BASE_URL}/add`,
    { productId, quantity },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
};

// Remove a product from the cart
export const removeFromCart = async (token, productId) => {
  if (!token) throw new Error("No token provided");
  const res = await axios.delete(`${BASE_URL}/remove/${productId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};

// Clear the entire cart
export const clearCart = async (token) => {
  if (!token) throw new Error("No token provided");
  const res = await axios.delete(`${BASE_URL}/clear`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
};
