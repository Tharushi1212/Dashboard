import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productImages: {
      type: String,
    },
    SKU: {
      type: String,
      required: true,
    },
    qty: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    productName: {
      type: String,
      required: true,
    },
    
  },
  {
    timestamps: true,
  }
);

const Products = mongoose.model("products", productSchema);
export default Products;
