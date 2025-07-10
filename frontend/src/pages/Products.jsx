import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Products() {
  // Raw products from the backend
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);

  // Search text
  const [search, setSearch] = useState("");

  // Set of selected category names
  const [selectedCategories, setSelectedCategories] = useState([]);

  // 1. Fetch products on mount
  useEffect(() => {
    fetchProducts();
  }, []);

  // 2. Once products are fetched, compute unique categories
  useEffect(() => {
    if (products.length > 0) {
      const uniqueCats = Array.from(
        new Set(products.map((p) => p.category || "Uncategorized"))
      );
      setCategories(uniqueCats);
    }
  }, [products]);

  // Fetch all products (unfiltered) from the backend.
  // Your backend route should populate sellerId with the seller's name, e.g.:
  //   Product.find(query).populate("sellerId", "name")
  const fetchProducts = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/products`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // 3. Handle selecting/unselecting categories
  const handleCategoryChange = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  // 4. Perform client-side filtering
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase());
    if (selectedCategories.length === 0) {
      return matchesSearch;
    } else {
      const productCategory = product.category || "Uncategorized";
      return matchesSearch && selectedCategories.includes(productCategory);
    }
  });

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Products</h2>

      {/* Search input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by product name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border p-2 rounded w-full md:w-1/2"
        />
      </div>

      {/* Category checkboxes */}
      <div className="mb-4">
        <p className="font-semibold mb-2">Filter by Category:</p>
        <div className="flex flex-wrap gap-4">
          {categories.map((cat) => (
            <label key={cat} className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={selectedCategories.includes(cat)}
                onChange={() => handleCategoryChange(cat)}
              />
              <span>{cat}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Product list */}
      {filteredProducts.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white shadow-md rounded p-4 flex flex-col justify-between"
            >
              <div>
                <h3 className="text-xl font-semibold">
                  <Link to={`/item/${product._id}`}>{product.name}</Link>
                </h3>
                <p className="text-gray-600 mt-1">${product.price}</p>
                <p className="text-gray-500 mt-2">{product.description}</p>
                {/* Display seller's name; assumes backend populated sellerId */}
                <p className="text-sm text-gray-500 mt-2">
              Seller: {product.sellerId?.firstName || "N/A"}
              </p>
              </div>
              <p className="text-gray-400 mt-4">
                Category: {product.category || "Uncategorized"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
