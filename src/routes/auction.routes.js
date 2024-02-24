const express = require("express");
const auctionController = require("../controllers/auction.controller");
const authCheck = require("../middleware/auth.middleware");

const router = express.Router();

router.route("/").get(auctionController.getAllAuctions);

router.route("/:aId").get(auctionController.getAuctionById);

router.route("/:pId").post(auctionController.addAuction);

router
  .route("/bid/:aId")
  .get(auctionController.getBidders)
  .post(authCheck, auctionController.bidAuction);

router.route("/calculate/:aId").get(auctionController.decideAuctionWinner);

module.exports = router;
