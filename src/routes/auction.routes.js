const express = require("express");
const auctionController = require("../controllers/auction.controller");
const authCheck = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(authCheck, auctionController.getAllAuctions);

router.route("/:aId").get(authCheck, auctionController.getAuctionById);

router.route("/:pId").post(authCheck, auctionController.addAuction);

router
  .route("/bid/:aId")
  .get(authCheck, auctionController.getBidders)
  .post(authCheck, auctionController.bidAuction);

router
  .route("/calculate/:aId")
  .get(authCheck, auctionController.decideAuctionWinner);

module.exports = router;
