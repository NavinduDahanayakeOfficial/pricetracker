import { PriceHistoryItems } from "@/types";
import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
   {
      url: { type: String, required: true, unique: true },
      title: { type: String, required: true },
      currency: { type: String, required: true },
      image: { type: String, required: true },
      currentPrice: { type: Number, required: true },
      originalPrice: { type: Number, required: true },
      PriceHistoryItems: [
         {
            price: { type: Number, required: true },
            date: { type: Date, default: Date.now },
         },
      ],
      highestPrice: Number,
      lowestPrice: Number,
      averagePrice: Number,
      discountRate: Number,
      description: String,
      category: String,
      reviewCount: Number,
      stars: Number,
      isOutOfStock: { type: Boolean, default: false },
      users: [
         {
            email: { type: String, required: true },
         },
      ],
      default: [],
   },
   { timestamps: true }
);

const Product = mongoose.models.Products || mongoose.model("Product", productSchema);

export default Product;