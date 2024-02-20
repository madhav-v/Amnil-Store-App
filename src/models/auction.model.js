const mongoose = require("mongoose");

const AuctionSchema = new mongoose.Schema({
  product: {
    type: mongoose.Types.ObjectId,
    ref: "Products",
    required: true,
  },
  startTime: {
    type: Date,
    default: Date.now,
    required: true,
  },
  endTime: {
    type: Date,
    required: true,
  },
  currentBid: {
    type: Number,
    default: 0,
  },
  bids: [
    {
      bidder: {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
      bidAmount: {
        type: Number,
        required: true,
      },
    },
  ],
});

const AuctionModel = mongoose.model("Auction", AuctionSchema);
module.exports = AuctionModel;
