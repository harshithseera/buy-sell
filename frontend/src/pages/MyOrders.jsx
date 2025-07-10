import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyOrders() {
  const { user } = useContext(AuthContext);
  const token = user?.token;
  const [buyerOrders, setBuyerOrders] = useState([]);
  const [sellerOrders, setSellerOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("pending");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchOrders = async () => {
      if (!token) {
        setError("User not authenticated");
        setLoading(false);
        return;
      }
      try {
        // Fetch orders where user is buyer
        const buyerRes = await axios.get(`${API_BASE_URL}/orders/my-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBuyerOrders(Array.isArray(buyerRes.data) ? buyerRes.data : []);

        // Fetch orders where user is seller
        const sellerRes = await axios.get(`${API_BASE_URL}/orders/seller-orders`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSellerOrders(Array.isArray(sellerRes.data) ? sellerRes.data : []);
      } catch (err) {
        console.error("Error fetching orders:", err.response?.data || err.message);
        setError("Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [token]);

  if (loading) return <div>Loading orders...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Filter buyer orders for pending vs bought
  const pendingOrders = buyerOrders.filter(order => order.status.toLowerCase() === "pending");
  const boughtOrders = buyerOrders.filter(order => order.status.toLowerCase() !== "pending");

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Orders History</h2>
      <div className="flex space-x-4 mb-4">
        <button 
          onClick={() => setActiveTab("pending")} 
          className={activeTab === "pending" ? "bg-blue-500 text-white p-2 rounded" : "bg-gray-300 text-black p-2 rounded"}
        >
          Pending Orders
        </button>
        <button 
          onClick={() => setActiveTab("bought")} 
          className={activeTab === "bought" ? "bg-blue-500 text-white p-2 rounded" : "bg-gray-300 text-black p-2 rounded"}
        >
          Bought Orders
        </button>
        <button 
          onClick={() => setActiveTab("sold")} 
          className={activeTab === "sold" ? "bg-blue-500 text-white p-2 rounded" : "bg-gray-300 text-black p-2 rounded"}
        >
          Sold Orders
        </button>
      </div>

      {activeTab === "pending" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Pending Orders</h3>
          {pendingOrders.length === 0 ? (
            <p>No pending orders.</p>
          ) : (
            pendingOrders.map(order => (
              <div key={order._id} className="border p-4 rounded mb-2">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ${order.totalPrice}</p>
                <p><strong>OTP:</strong> {order.otp ? "OTP Generated" : "Not Generated"}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "bought" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Bought Orders</h3>
          {boughtOrders.length === 0 ? (
            <p>No past orders found.</p>
          ) : (
            boughtOrders.map(order => (
              <div key={order._id} className="border p-4 rounded mb-2">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ${order.totalPrice}</p>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === "sold" && (
        <div>
          <h3 className="text-lg font-semibold mb-2">Sold Orders</h3>
          {sellerOrders.length === 0 ? (
            <p>No sold orders found.</p>
          ) : (
            sellerOrders.map(order => (
              <div key={order._id} className="border p-4 rounded mb-2">
                <p><strong>Order ID:</strong> {order._id}</p>
                <p><strong>Status:</strong> {order.status}</p>
                <p><strong>Total:</strong> ${order.totalPrice}</p>
                <p><strong>Buyer:</strong> {order.buyerId?.firstName} {order.buyerId?.lastName}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
