import React, { useState, useEffect, useContext } from "react";
import { fetchCart, removeFromCart, clearCart } from "../api/cart.js";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Cart() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [cartItems, setCartItems] = useState([]);

  // Get the token from user context
  const token = user?.token;

  // Fetch cart data on component mount
  useEffect(() => {
    const getCart = async () => {
      try {
        const data = await fetchCart(token);
        setCartItems(data);
      } catch (error) {
        console.error("Error fetching cart:", error);
      }
    };
    getCart();
  }, [token]);

  // Remove item from cart
  const handleRemove = async (productId) => {
    try {
      const data = await removeFromCart(token, productId);
      setCartItems(data);
    } catch (error) {
      console.error("Error removing item:", error);
    }
  };

  // Clear entire cart
  const handleClearCart = async () => {
    try {
      const data = await clearCart(token);
      setCartItems(data);
    } catch (error) {
      console.error("Error clearing cart:", error);
    }
  };

  // Handle Order Placement
  const handlePlaceOrder = async () => {
    try {
      const res = await axios.post(
        `${API_BASE_URL}/orders/place`,
        {},
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      alert("Orders placed successfully!");
      setCartItems([]); // Clear frontend cart state
    } catch (error) {
      console.error("Error placing order:", error);
      alert("Failed to place order.");
    }
  };
  

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.product.price * item.quantity,
    0
  );

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="bg-white shadow rounded p-4">
          {cartItems.map((item) => (
            <div key={item.product._id} className="flex justify-between items-center border-b p-4">
              <div>
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p>
                  ${item.product.price} x {item.quantity} = ${item.product.price * item.quantity}
                </p>
              </div>
              <button
                onClick={() => handleRemove(item.product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </div>
          ))}
          <div className="flex justify-between items-center mt-4">
            <h3 className="text-lg font-semibold">Total: ${totalPrice.toFixed(2)}</h3>
            <div className="space-x-2">
              <button
                onClick={handleClearCart}
                className="bg-gray-500 text-white px-4 py-2 rounded"
              >
                Clear Cart
              </button>
              <button
                onClick={handlePlaceOrder}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
