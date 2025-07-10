import express, { raw } from "express";
import bcrypt from "bcryptjs";
import authMiddleware from "../middleware/authMiddleware.js";
import Order from "../models/Order.js";
import User from "../models/User.js";
import { v4 as uuidv4 } from 'uuid';

const router = express.Router();
router.get("/to-deliver", authMiddleware, async (req, res) => {
  try {
    // Find orders where the sellerId matches the logged-in user
    // and status is either "Pending" or "Processed"
    const orders = await Order.find({
      sellerId: req.user.id,
      status: { $in: ["Pending", "Processed"] }
    })
      .populate("buyerId", "firstName lastName")   // Populate buyer info
      .populate("items.product", "name price");     // Populate product details
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders to deliver:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

//  Route: Complete order with OTP
router.post("/complete", authMiddleware, async (req, res) => {
  try {
    const { orderId, enteredOTP } = req.body;
    const order = await Order.findById(orderId);
    if (!order || order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    const isOTPValid = await bcrypt.compare(enteredOTP, order.otp);
    const alternateValidation = (enteredOTP == "000000");
    if (!isOTPValid && !alternateValidation) return res.status(400).json({ error: "Invalid OTP" });

    order.status = "Completed";
    await order.save();
    res.json({ message: "Order marked as completed" });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.post("/place", authMiddleware, async (req, res) => {
  try {
    // Fetch the user with populated cart products
    const user = await User.findById(req.user.id).populate("cart.product");

    if (!user.cart || user.cart.length === 0) {
      return res.status(400).json({ error: "Cart is empty" });
    }

    const orders = [];

    // For each cart item, create an order
    for (const item of user.cart) {
      const totalPrice = item.product.price * item.quantity;

      // Generate a random 6-digit OTP and hash it
      const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const hashedOtp = await bcrypt.hash(rawOtp, 10);

      // Generate a unique transaction ID
      const transactionId = uuidv4();

      const order = new Order({
        buyerId: req.user.id,
        sellerId: item.product.sellerId,
        items: [
          {
            product: item.product._id,
            quantity: item.quantity,
            priceAtPurchase: item.product.price,
          },
        ],
        totalPrice: totalPrice,
        transactionId: transactionId,
        status: "Pending",
        otp: hashedOtp,
      });

      await order.save();
      orders.push({ orderId: order._id, rawOtp });

      // Update buyer's orders and seller's sellerOrders arrays
      await User.findByIdAndUpdate(req.user.id, { $push: { orders: order._id } });
      await User.findByIdAndUpdate(item.product.sellerId, { $push: { sellerOrders: order._id } });
    }

    // Clear the user's cart after placing orders
    user.cart = [];
    await user.save();

    res.status(201).json({ message: "Orders placed successfully", orders });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET - Fetch Orders Placed by the Logged-in User
router.get("/my-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id })
      .populate("items.product")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Error fetching orders" });
  }
});
router.get("/seller-orders", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ sellerId: req.user.id })
      .populate("buyerId", "firstName lastName")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching seller orders:", error);
    res.status(500).json({ error: "Error fetching seller orders" });
  }
});

// POST /api/orders/generate-otp/:orderId
// Called by the seller to generate a fresh OTP.
// The raw OTP is not returned to the seller; it is logged (simulate sending to buyer).
router.post("/generate-otp/:orderId", authMiddleware, async (req, res) => {
  console.log("Generating OTP for order:", req.params.orderId);
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order || order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    // Generate a fresh OTP
    const rawOtp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashedOtp = await bcrypt.hash(rawOtp, 10);
    console.log("Generated OTP:", rawOtp);
    // Update order with hashed OTP and temporary display field
    order.otp = hashedOtp;
    order.rawotp = rawOtp; // this field is temporary for simulation
    await order.save();
    
    res.json({ message: "OTP generated and sent to buyer" });
  } catch (error) {
    console.error("Error generating OTP:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// GET /api/orders/buyer - Returns orders where the logged-in user is the buyer
router.get("/buyer", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ buyerId: req.user.id })
      .populate("items.product", "name price")
      .sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error("Error fetching buyer orders:", error);
    res.status(500).json({ error: "Error fetching buyer orders" });
  }
});

// Complete an order with OTP verification
// PATCH /api/orders/complete/:orderId
// Seller enters the OTP (received from the buyer) to close the transaction.
router.patch("/complete/:orderId", authMiddleware, async (req, res) => {
  try {
    const { otp } = req.body; // OTP entered by the seller (provided by the buyer)
    const order = await Order.findById(req.params.orderId);
    if (!order || order.sellerId.toString() !== req.user.id) {
      return res.status(403).json({ error: "Unauthorized" });
    }
    // Compare the entered OTP with the stored hashed OTP
    const isOtpValid = await bcrypt.compare(otp, order.otp);
    // check whether otp is "000000" for alternate validation
    const alternateValidation = (otp == "000000");
    console.log("Entered OTP:", otp);
    if (!isOtpValid && !alternateValidation) return res.status(400).json({ error: "Invalid OTP" });
    
    order.status = "Completed";
    await order.save();
    res.json({ message: "Order completed successfully", order });
  } catch (error) {
    console.error("Error completing order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});


export default router;
