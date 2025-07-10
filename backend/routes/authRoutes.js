import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import dotenv from "dotenv";
import authMiddleware from "../middleware/authMiddleware.js";

dotenv.config();
const router = express.Router();

console.log("Auth route file loaded");

// register a new user
router.post("/register", async (req, res) => {
  try {
    const { firstName, lastName, email, age, contactNumber, password } = req.body;
    
    // validate iiit mail 
    if (!/@iiit\.ac\.in$/i.test(email)) {
      return res.status(400).json({ error: "Email must be an IIIT email." });
    }
  
    // confirm unique user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists." });
    }
  
    // create user
    const newUser = new User({ firstName, lastName, email, age, contactNumber, password });
    await newUser.save();
  
    res.status(201).json({ message: "User registered successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error registering user" });
  }
});


// LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found ehuhuhui" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


// UPDATE PROFILE
router.put("/update-profile", authMiddleware, async (req, res) => {
  try {
    // Define which fields are allowed to be updated
    const allowedFields = ["firstName", "lastName", "email", "age", "contactNumber"];
    const updates = {};

    // Filter out any fields that are not allowed
    Object.keys(req.body).forEach((key) => {
      if (allowedFields.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Update the user document and return the new document
    const updatedUser = await User.findByIdAndUpdate(req.user.id, updates, { new: true, runValidators: true });

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updatedUser);
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
