const Cart = require("./../models/cart.model");
const pool = require("../config/mongoose.config");
const logger = require("../config/logger.config");

exports.getAllCarts = async (req, res) => {
  try {
    const query = `
      SELECT * FROM cart;
    `;
    const { rows } = await pool.query(query);
    logger.info("Cart loaded successfully");
    res.json({
      status: "success",
      result: rows.length,
      data: rows,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message,
    });
  }
};

exports.addToCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const cartItem = JSON.stringify(req.body);
    const totalPrice = req.body.price * req.body.quantity;
    const query = `
    INSERT INTO cart (user_id, cart_items, total)
    VALUES ($1, $2, $3)
    ON CONFLICT (user_id) DO UPDATE
    SET cart_items = cart.cart_items || $2, total = cart.total + $3
    RETURNING *;
    `;
    const values = [userId, cartItem, totalPrice];
    const { rows } = await pool.query(query, values);
    res.status(201).json({
      status: "success",
      msg: "Added to cart",
      data: rows[0],
    });
    logger.info("Added to cart successfully");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message,
    });
  }
};

exports.getUserCart = async (req, res) => {
  try {
    const userId = req.params.userId;
    const query = `
      SELECT * FROM cart WHERE user_id = $1;
    `;
    const { rows } = await pool.query(query, [userId]);
    res.status(200).json({
      status: "success",
      result: rows.length,
      cart: rows,
    });
    logger.info("Cart loaded successfully");
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message,
    });
  }
};
