const router = require("express").Router();
const orderCtrl = require("../controllers/order.controller");
const authCheck = require("../middleware/auth.middleware");

router.route("/").post(authCheck, orderCtrl.addToCart);
router.get("/list-all", authCheck, orderCtrl.listAll);
router.post("/detail", authCheck, orderCtrl.getCartDetail);
router.post("/setCart", authCheck, orderCtrl.placeOrder);

module.exports = router;
