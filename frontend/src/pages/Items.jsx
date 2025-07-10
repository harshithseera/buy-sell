import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCart } from "../context/CartContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;


export default function ItemPage() {
  if (localStorage.getItem("user") === null) {
    localStorage.setItem("user", JSON.stringify({ user: null }));
  }
  const usercurr = JSON.parse(localStorage.getItem("user")).user._id;
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const { addToCart } = useCart();
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/products/${id}`);
        setProduct(res.data);
      } catch (error) {
        console.error("Error fetching product:", error);
      }
    };
    fetchProduct();
  }, [id]);
  let strw=product;
  console.log(product,usercurr);
  // console.log(product.name,usercurr);
  // console.log("lets see",typeof(product._id),typeof(usercurr));
  const handleAddToCart = () => {
    // while(product==null){}
    if (product._id==usercurr) {
      navigate("/cart");
      location.reload();
      return;
    }
    if (product) {
      addToCart(product, 1,usercurr);
      navigate("/cart");
      location.reload();
    }
  };

  if (!product) return <div>Loading...</div>;
  // console.log(product);
  return (
    <div className="container mx-auto p-6">
      <div className="bg-white p-6 rounded shadow-md">
        <h2 className="text-2xl font-bold mb-2">{product.name}</h2>
        <p className="text-gray-600 mb-2">${product.price}</p>
        <p className="text-gray-700 mb-4">{product.description}</p>
        <button
          onClick={handleAddToCart}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
