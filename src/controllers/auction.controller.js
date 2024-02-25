const Auction = require("../models/auction.model");
const User = require("../models/user.model");
const pool = require("../config/mongoose.config");
exports.addAuction = async (req, res) => {
  try {
    const product_id = req.params.pId;
    const currentTime = new Date();
    const endDate = new Date(req.body.endDate);
    const timeDiff = endDate - currentTime;
    if (timeDiff < 0) {
      throw "Invalid end time ";
    }
    const query = `
      INSERT INTO auction (product_id, start_date, end_date)
      VALUES ($1, $2, $3)
      RETURNING *;
    `;
    const values = [product_id, new Date(), new Date(req.body.endDate)];
    const { rows } = await pool.query(query, values);
    res.json({
      status: "success",
      data: rows[0],
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
    const query = `
      SELECT * FROM auction;
    `;
    const { rows } = await pool.query(query);
    res.json({
      status: "success",
      result: rows.length,
      data: rows,
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
    const query = `
      SELECT * FROM auction WHERE id = $1;
    `;
    const values = [auctionId];
    const { rows } = await pool.query(query, values);
    res.json({
      status: "success",
      data: rows[0],
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

    const userQuery = `
    SELECT * FROM users
    WHERE id = $1;
  `;
    const userValues = [user_id];
    const userResult = await pool.query(userQuery, userValues);
    const user = userResult.rows[0];

    if (!user) {
      throw "Invalid user";
    }

    const auctionId = req.params.aId;
    const query = `
    UPDATE auction
    SET bidder = COALESCE(bidder, '[]'::jsonb) || $1
    WHERE id = $2
    RETURNING *;
  `;
    const values = [{ user_id, bid_amount }, auctionId];
    const { rows } = await pool.query(query, values);
    res.json({
      status: "success",
      data: rows[0],
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
    const auctionId = req.params.aId;
    const query = `
      SELECT bidder FROM auction WHERE id = $1;
    `;
    const values = [auctionId];
    const { rows } = await pool.query(query, values);
    res.json({
      status: "success",
      data: rows[0],
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
    const auctionId = req.params.aId;
    const query = `
      SELECT bidder FROM auction WHERE id = $1;
    `;
    const values = [auctionId];
    const { rows } = await pool.query(query, values);

    const winner = rows[0].bidder.reduce((acc, curr) => {
      if (curr.bid_amount > acc.bid_amount) acc = curr;
      return acc;
    });

    const updateQuery = `
      UPDATE auction
      SET auction_winner_id = $1, auction_bid_final_amount = $2
      WHERE id = $3
      RETURNING *;
    `;
    const updateValues = [winner.user_id, winner.bid_amount, auctionId];
    const { rows: updatedRows } = await pool.query(updateQuery, updateValues);

    res.json({
      status: "success",
      data: updatedRows[0],
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      msg: err,
    });
  }
};
