import mongoose from "mongoose";

const CartItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", 
    required: true 
  },
  quantity: { 
    type: Number, 
    default: 1, 
    required: true 
  }
});

const CartSchema = new mongoose.Schema(
  {
    buyerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true, 
      unique: true
    },
    items: [CartItemSchema]
  },
  { timestamps: true }
);

export default mongoose.model("Cart", CartSchema);
