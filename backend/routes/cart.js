// backend/routes/cart.js
import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import User from "../models/User.js";
import Product from "../models/Product.js";

const router = express.Router();

// GET - Retrieve the current user's cart (with product details)
router.get("/", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("cart.product", "name price description category");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user.cart);
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ error: "Error fetching cart" });
  }
});

// POST - Add a product to the user's cart (or update quantity if it exists)
router.post("/add", authMiddleware, async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    if (!productId) {
      return res.status(400).json({ error: "Product ID is required" });
    }
    // Verify the product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Check if the product is already in the cart
    const itemIndex = user.cart.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Increase quantity of existing item
      user.cart[itemIndex].quantity += quantity || 1;
    } else {
      // Add new cart item
      user.cart.push({ product: productId, quantity: quantity || 1 });
    }

    await user.save();
    // Populate the product details before returning
    await user.populate("cart.product", "name price description category");
    res.json(user.cart);
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).json({ error: "Error adding to cart" });
  }
});

// DELETE - Remove an item from the cart by product ID
router.delete("/remove/:productId", authMiddleware, async (req, res) => {
  try {
    const { productId } = req.params;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.cart = user.cart.filter(
      (item) => item.product.toString() !== productId
    );
    await user.save();
    await user.populate("cart.product", "name price description category");
    res.json(user.cart);
  } catch (error) {
    console.error("Error removing from cart:", error);
    res.status(500).json({ error: "Error removing from cart" });
  }
});

// DELETE - Clear the entire cart
router.delete("/clear", authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    user.cart = [];
    await user.save();
    res.json(user.cart);
  } catch (error) {
    console.error("Error clearing cart:", error);
    res.status(500).json({ error: "Error clearing cart" });
  }
});

export default router;
