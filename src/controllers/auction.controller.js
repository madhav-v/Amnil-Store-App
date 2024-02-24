const Auction = require("../models/auction.model");
const User = require("../models/user.model");

exports.addAuction = async (req, res) => {
  try {
    const currentTime = new Date();
    const endDate = new Date(req.body.endDate);
    const timeDiff = endDate - currentTime;
    if (timeDiff < 0) {
      throw "Invalid end time ";
    }
    const auction = await Auction.create({
      product_id: req.params.productId,
      start_date: new Date(),
      end_date: new Date(req.body.endDate),
    });
    res.json({
      status: "success",
      data: auction,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.json({
      status: "success",
      result: auctions.length,
      data: auctions,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.getAuctionById = async (req, res) => {
  try {
    const auctionId = req.params.id;
    const auction = await Auction.findOne(auctionId);
    res.json({
      status: "success",
      data: auction,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.bidAuction = async (req, res) => {
  try {
    const user_id = req.authUser.id;
    const { bid_amount } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      throw "Invalid user";
    }

    const auction = await Auction.findByIdAndUpdate(
      req.params.auctionId,
      { $push: { bidder: { user_id, bid_amount } } },
      { new: true }
    );
    res.json({
      status: "success",
      data: auction,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.getBidders = async (req, res) => {
  try {
    const auctionId = req.params.auctionId;
    const bidderList = await Auction.findById(auctionId).select("bidder -_id ");
    res.json({
      status: "success",
      data: bidderList,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};

exports.decideAuctionWinner = async (req, res) => {
  try {
    const auctionId = req.params.auctionId;
    const bidderList = await Auction.findById(auctionId).select("bidder -_id ");
    //calculating winner
    const winner = bidderList.bidder.reduce((acc, curr) => {
      if (curr.bid_amount > acc.bid_amount) acc = curr;
      return acc;
    });

    //updating auction for winner
    const updatedAuction = await Auction.findByIdAndUpdate(
      auctionId,
      {
        auction_winner_id: winner.user_id,
        auction_bid_final_amount: winner.bid_amount,
      },
      { new: true }
    );
    res.json({
      status: "success",
      data: updatedAuction,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};
