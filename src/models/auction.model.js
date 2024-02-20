const mongoose = require("mongoose");

const auctionProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    images: {
      type: Array,
    },
    endTime: {
      type: Date,
      required: true,
    },
    bidHistory: [
      {
        bidder: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
          required: true,
        },
        bidAmount: {
          type: Number,
          required: true,
        },
        bidTime: {
          type: Date,
          default: Date.now,
        },
      },
    ],
    status: {
      type: String,
      enum: ["active", "sold", "expired"],
      default: "active",
    },
  },
  { timestamps: true }
);

const AuctionProductModel = mongoose.model(
  "AuctionProduct",
  auctionProductSchema
);

module.exports = AuctionProductModel;
