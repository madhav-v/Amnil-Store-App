const Order = require("../models/order.model");
const Cart = require("../models/cart.model");
const pool = require("../config/mongoose.config");
exports.getAllOrders = async (req, res) => {
  try {
    const query = `
      SELECT * 
      FROM orders;
    `;
    const orders = await pool.query(query);

    res.json({
      status: "success",
      result: orders.rows.length,
      data: orders.rows,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err.message,
    });
  }
};

exports.checkoutOrder = async (req, res) => {
  try {
    const userId = req.params.userId;

    // SQL query to find the user's cart
    const findCartQuery = `
      SELECT * 
      FROM cart
      WHERE user_id = $1;
    `;
    const findCartValues = [userId];
    const carts = await pool.query(findCartQuery, findCartValues);

    if (!carts.rows.length) {
      return res.status(400).json({
        status: "fail",
        msg: "Cart is empty",
      });
    }

    const insertOrderQuery = `
      INSERT INTO orders (user_id, order_items, total)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const insertOrderValues = [
      userId,
      JSON.stringify(carts.rows[0].cart_items),
      carts.rows[0].total,
    ];
    const newOrder = await pool.query(insertOrderQuery, insertOrderValues);

    // SQL query to delete the user's cart
    const deleteCartQuery = `
      DELETE FROM cart
      WHERE user_id = $1;
    `;
    const deleteCartValues = [userId];
    await pool.query(deleteCartQuery, deleteCartValues);

    res.status(200).json({
      status: "success",
      msg: "Order has been placed",
      data: newOrder.rows[0],
    });
  } catch (err) {
    res.status(404).json({
      status: "fail",
      msg: err.message,
    });
  }
};
