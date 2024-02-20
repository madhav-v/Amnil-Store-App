const AuctionProductModel = require("../models/auction.model");

class AuctionController {
  createAunctionProduct = async (req, res, next) => {
    try {
      let data = req.body;
      console.log("Data", data);
      if (req.files) {
        data.images = req.files.map((item) => {
          return item.filename;
        });
      }
      const { name, endTime, images } = data;
      const newProduct = new AuctionProductModel({
        name,
        images,
        endTime,
      });
      const savedProduct = await newProduct.save();
      res.json({
        result: savedProduct,
        msg: "Auction product created successfully.",
        status: true,
      });
    } catch (exception) {
      next(exception);
    }
  };

  getActiveAuction = async (req, res, next) => {
    try {
      const currentTime = new Date();
      const products = await AuctionProductModel.find({
        endTime: { $gt: currentTime },
        status: "active",
      });
      res.json({
        result: products,
        msg: "Auction products",
        status: true,
      });
    } catch (exception) {
      next(exception);
    }
  };

  placeBid = async (req, res, next) => {
    try {
      let userId = req.authUser?.id;
      let { auctionId, bidAmount } = req.body;
      const auction = await AuctionProductModel.findById(auctionId);
      if (auction.status !== "active") {
        return res.json({
          msg: "This product is not available for bidding.",
          status: false,
        });
      }
      const currentHighestBid =
        auction.bidHistory.length > 0
          ? auction.bidHistory[0].bidAmount
          : auction.price;
      if (bidAmount <= currentHighestBid) {
        return res.status(400).json({
          message: "Your bid must be higher than the current highest bid.",
        });
      }

      auction.bidHistory.unshift({ bidder: userId, bidAmount });
      await auction.save();

      res.json({ message: "Bid placed successfully." });
    } catch (exception) {
      next(exception);
    }
  };
}

const auctionCtrl = new AuctionController();
module.exports = auctionCtrl;
