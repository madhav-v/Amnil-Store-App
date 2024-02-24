const Cart = require("./../models/cart.model");

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json({
      status: "success",
      result: carts.length,
      data: carts,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.params.userId;

    userCart = await Cart.findOne({ userId });
    let cart;
    if (!userCart || userCart.length === 0) {
      cart = await Cart.create({
        userId,
        cart: [req.body],
        total: req.body.price * req.body.quantity,
      });
    } else {
      userCart.cart.push(req.body);
      userCart.total += req.body.price * req.body.quantity;
      cart = await userCart.save();
    }

    res.status(201).json({
      status: "success",
      msg: "Added to cart",
      data: cart,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const userCart = await Cart.find({ userId });
    res.status(200).json({
      status: "success",
      result: userCart.length,
      cart: userCart,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};
