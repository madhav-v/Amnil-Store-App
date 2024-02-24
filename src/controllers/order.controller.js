const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find();
    res.json({
      status: "success",
      result: orders.length,
      data: orders,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.checkoutOrder = async (req, res) => {
  try {
    const userId = req.params.userId;

    const carts = await Cart.findOne({ userId });
    console.log(carts);
    if (!carts) {
      return res.status(400).json({
        status: "fail",
        msg: "Cart is empty",
      });
    }
    const newOrder = await Order.create({
      userId,
      cart: carts.cart,
      total: carts.total,
    });
    await Cart.findOneAndDelete({ userId });
    res.status(200).json({
      status: "success",
      msg: "Order has been placed",
      data: newOrder,
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      msg: err,
    });
  }
};
