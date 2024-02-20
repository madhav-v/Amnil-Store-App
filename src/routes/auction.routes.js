const auctionCtrl = require("../controllers/auction.controller");
const authCheck = require("../middleware/auth.middleware");
const uploader = require("../middleware/uploader.middleware");
const router = require("express").Router();
const uploadPath = (req, res, next) => {
  req.uploadPath = "./public/auction/";
  next();
};

router
  .route("/")
  .post(
    authCheck,
    uploadPath,
    uploader.array("images"),
    auctionCtrl.createAunctionProduct
  );
router.get("/", authCheck, auctionCtrl.getActiveAuction);
router.post("/bid", authCheck, auctionCtrl.placeBid);

module.exports = router;
