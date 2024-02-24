const express = require("express");
const cartController = require("../controllers/cart.controller");

const router = express.Router();


router.route("/").get(cartController.getAllCarts);
router.route("/:userId").get(cartController.getUserCart);
router.route("/:userId/addToCart").post(cartController.addToCart);

module.exports = router;
