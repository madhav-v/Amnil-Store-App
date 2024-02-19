const mongoose = require("mongoose");
const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    categories: {
      type: String,
      require: true,
    },
    detail: {
      type: String,
    },
    price: {
      type: Number,
      require: true,
      min: 1,
    },
    stock: {
      type: Number,
      default: 0,
    },
    images: {
      type: Array,
    },
    sellerId: {
      type: mongoose.Types.ObjectId,
      default: null,
      ref: "User",
    },
  },
  {
    timestamps: true,
    autoIndex: true,
  }
);

const ProductModel = mongoose.model("Products", ProductSchema);
module.exports = ProductModel;
