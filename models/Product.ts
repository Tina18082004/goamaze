import mongoose, { Schema, Document, Model } from "mongoose";

export interface IProduct extends Document {
  title: string;
  subtitle: string;
  description?: string;
  price: string;
  originalPrice: string;
  category: string;
  image: string;
  affiliateLink: string;
  badge: string;
  rating: number;
  reviews: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    title:         { type: String, required: true, trim: true },
    subtitle:      { type: String, required: true, trim: true },
    description:   { type: String, trim: true, default: "" },
    price:         { type: String, required: true },
    originalPrice: { type: String, required: true },
    category:      { type: String, required: true, trim: true },
    image:         { type: String, required: true },
    affiliateLink: { type: String, required: true },
    badge:         { type: String, default: "New" },
    rating:        { type: Number, default: 4.5, min: 0, max: 5 },
    reviews:       { type: Number, default: 0, min: 0 },
    featured:      { type: Boolean, default: false },
  },
  { timestamps: true }
);

// Text index for search
ProductSchema.index({ title: "text", subtitle: "text", category: "text" });

const Product: Model<IProduct> =
  mongoose.models.Product || mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
