const express = require("express");
const orderController = require("../controllers/order.controller");

const router = express.Router();

router.route("/").get(authCheck, orderController.getAllOrders);
router
  .route("/:userId/checkout")
  .post(authCheck, orderController.checkoutOrder);

module.exports = router;
