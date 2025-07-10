import { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function MyProducts() {
  const { user } = useContext(AuthContext);
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    category: "",
  });

  // Fetch current listed products on component mount or when user changes
  useEffect(() => {
    if (user) {
      fetchMyProducts();
    }
  }, [user]);

  // GET request to fetch products of logged-in seller
  const fetchMyProducts = async () => {
    try {
      // Make sure your backend route is /api/products/myproducts
      const res = await axios.get(`${API_BASE_URL}/products/myproducts`, {
        headers: {
          Authorization: `Bearer ${user.token}`, // If user.token holds the JWT
        },
      });
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // POST request to add a new product
  const addProduct = async (e) => {
    e.preventDefault();
    console.log("Adding product:", user.token);
    try {
      await axios.post(
        `${API_BASE_URL}/products`,
        {
          name: form.name,
          price: form.price,
          description: form.description,
          category: form.category,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );
      alert("Product added successfully!");
      // Clear the form
      setForm({ name: "", price: "", description: "", category: "" });
      // Refresh the list
      fetchMyProducts();
    } catch (error) {
      console.error("Error adding product:", error);
      alert("Could not add product.");
    }
  };

  // Handle form input changes
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Optional: handle delete or other actions
  const handleDelete = async (productId) => {
    try {
      await axios.delete(`${API_BASE_URL}/products/${productId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      // Remove the deleted product from state
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Could not delete product.");
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Products</h2>

      {/* Product List */}
      {products.length === 0 ? (
        <p className="text-gray-500 mb-6">You haven't listed any products yet.</p>
      ) : (
        <div className="bg-white shadow rounded mb-6 p-4">
          {products.map((product) => (
            <div key={product._id} className="flex justify-between items-center border-b p-3">
              <div>
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <p className="text-gray-600">${product.price}</p>
                <p className="text-gray-500">{product.description}</p>
                <span className="text-sm text-gray-400">Category: {product.category}</span>
              </div>
              <button
                onClick={() => handleDelete(product._id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Add New Product Form */}
      <div className="bg-white shadow rounded p-4">
        <h3 className="text-xl font-bold mb-4">Add a New Product</h3>
        <form onSubmit={addProduct}>
          <div className="mb-3">
            <label className="block mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Price</label>
            <input
              type="number"
              name="price"
              value={form.price}
              onChange={handleChange}
              className="w-full border rounded p-2"
              required
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Description</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <div className="mb-3">
            <label className="block mb-1">Category</label>
            <input
              type="text"
              name="category"
              value={form.category}
              onChange={handleChange}
              className="w-full border rounded p-2"
            />
          </div>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}
