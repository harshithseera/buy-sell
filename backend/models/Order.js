import mongoose from "mongoose";

const OrderedItemSchema = new mongoose.Schema({
  product: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "Product", required: true 
  },
  quantity: { 
    type: Number, 
    required: true 
  },
  priceAtPurchase: { 
    type: Number, 
    required: true 
  },
});

const OrderSchema = new mongoose.Schema(
  {
    transactionId: { 
      type: String, 
      required: true, 
      unique: true 
    },
    buyerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    sellerId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    items: [OrderedItemSchema],
    totalPrice: { 
      type: Number, 
      required: true
    },
    status: { 
      type: String, 
      enum: ["Pending", "Processed", "Completed"], 
      default: "Pending" 
    },
    otp: { 
      type: String, 
      required: true 
    }, // hashed otp
  },
  { timestamps: true }
);

export default mongoose.model("Order", OrderSchema);
