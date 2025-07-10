import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import Product from "../models/Product.js";

console.log("Loading product routes...");
const router = express.Router();

// GET - Fetch products created by the logged-in seller (my products)
// Here we populate the sellerId field with only the "name" from the User collection.
router.get("/myproducts", authMiddleware, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id })
      .populate("sellerId", "name");  // Populate seller's name
    return res.json(products);
  } catch (error) {
    console.error("Error fetching user products:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// GET - Fetch a single Product by ID and populate the seller's name
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("sellerId", "name"); // Only bring the name field from the User document
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    return res.json(product);
  } catch (error) {
    console.error("Error fetching product:", error);
    return res.status(500).json({ error: "Error fetching product" });
  }
});

// GET - Fetch all products (optionally filtered by category) and populate the seller's name
// For fetching all products:
router.get("/", async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};
    if (category) {
      query.category = category;
    }
    // Populate sellerId with only the "name" field from the User collection.
    const products = await Product.find(query).populate("sellerId", "firstName");
    return res.json(products);
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({ error: "Error fetching products" });
  }
});

// POST - Create a new Product
// After creating the product, we populate the seller's name before returning the response.
router.post("/", authMiddleware, async (req, res) => {
  console.log("hi");
  try {
    const { name, price, description, category } = req.body;
    const sellerId = req.user.id; // from decoded JWT

    const newProduct = new Product({ name, price, description, category, sellerId });
    await newProduct.save();
    
    // Populate the sellerId field for the created product before sending the response.
    const populatedProduct = await Product.findById(newProduct._id)
      .populate("sellerId", "name");
      
    res.status(201).json(populatedProduct);
  } catch (error) {
    console.error("Error adding product:", error);
    res.status(500).json({ error: "Error adding product" });
  }
});

// DELETE - Remove a Product by ID
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ error: "Error deleting product" });
  }
});

export default router;