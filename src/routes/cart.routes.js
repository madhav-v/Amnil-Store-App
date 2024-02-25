const express = require("express");
const cartController = require("../controllers/cart.controller");

const router = express.Router();

router.route("/").get(authCheck, cartController.getAllCarts);
router.route("/:userId").get(authCheck, cartController.getUserCart);
router.route("/:userId/addToCart").post(authCheck, cartController.addToCart);

module.exports = router;
