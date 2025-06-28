import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    supplier: { type: String, required: true },
    sku: { type: String, required: true, unique: true },
    category: {
      type: String,
      enum: [
        "Electronics",
        "Furniture",
        "Clothing",
        "Books",
        "Toys",
        "Beauty",
        "Sports",
        "Home Decor",
        "Home Appliances",
        "Others",
      ],
      required: true,
    },
    quantityInStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true, default: 0 },
    icon: { type: String }, // optional
  },
  { timestamps: true }
);

// Clear any cached model to ensure new schema is used
if (models.Product) {
  delete models.Product;
}

const Product = model("Product", ProductSchema);
export default Product;
