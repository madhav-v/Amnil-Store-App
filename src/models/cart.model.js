const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
});

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, "User id is required"],
  },
  cart: {
    type: [cartItemSchema],
    required: [true, "User must have an email"],
  },
  total: {
    type: Number,
  },
});

const Cart = mongoose.model("Cart", cartSchema);

module.exports = Cart;
