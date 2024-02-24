const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.route("/").get(orderController.getAllOrders);
router.route("/:userId/checkout").post(orderController.checkoutOrder);

module.exports = router;
