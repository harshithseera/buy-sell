import React, { createContext, useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error(
      "AuthContext is undefined. Make sure that CartProvider is wrapped inside AuthProvider."
    );
  }
  const { user } = authContext;

  const [cart, setCart] = useState(null);

  useEffect(() => {
    const fetchCart = async () => {
      if (user?.token) {
        try {
          const res = await axios.get(`${API_BASE_URL}/cart`, {
            headers: { Authorization: `Bearer ${user.token}` },
          });
          setCart(res.data);
        } catch (error) {
          console.error("Error fetching persistent cart:", error);
        }
      }
    };
    fetchCart();
  }, [user]);

  const addToCart = async (product, quantity = 1, curruser) => {
    console.log(product.sellerId._id,curruser);
    if(product.sellerId._id==curruser){return {message:"You cannot add your own product to the cart."};}
    let productId = product._id;
    if (!user?.token) return;
    try {
      const res = await axios.post(
        `${API_BASE_URL}/cart/add`,
        { productId, quantity },
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCart(res.data);
    } catch (error) {
      console.error("Error adding to persistent cart:", error);
    }
  };

  const removeFromCart = async (productId) => {
    if (!user?.token) return;
    try {
      const res = await axios.delete(
        `${API_BASE_URL}/cart/remove/${productId}`,
        { headers: { Authorization: `Bearer ${user.token}` } }
      );
      setCart(res.data);
    } catch (error) {
      console.error("Error removing from persistent cart:", error);
    }
  };

  const clearCart = async () => {
    if (!user?.token) return;
    try {
      const res = await axios.delete(`${API_BASE_URL}/cart/clear`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setCart(res.data);
    } catch (error) {
      console.error("Error clearing persistent cart:", error);
    }
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
