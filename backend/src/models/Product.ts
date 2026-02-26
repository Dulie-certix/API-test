import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  price: number;
  description: string;
  category: string;
  brand: string;
  stock: number;
  discountPercentage?: number;
  rating?: number;
  thumbnail?: string;
}

const productSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    stock: { type: Number, required: true },
    discountPercentage: { type: Number, default: 0 },
    rating: { type: Number, default: 0 },
    thumbnail: { type: String },
  },
  { timestamps: true },
);

export const Product = mongoose.model<IProduct>("Product", productSchema);
