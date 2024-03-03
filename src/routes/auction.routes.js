const express = require("express");
const auctionController = require("../controllers/auction.controller");
const authCheck = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/v1/auction:
 *   get:
 *     summary: Get all auctions
 *     description: Retrieve all auctions.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Auction'
 *       500:
 *         description: Internal server error
 */
router.get("/", authCheck, auctionController.getAllAuctions);

/**
 * @swagger
 * /api/v1/auction/{aId}:
 *   get:
 *     summary: Get auction by ID
 *     description: Retrieve an auction by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the auction to retrieve.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Auction'
 *       500:
 *         description: Internal server error
 */
router.get("/:aId", authCheck, auctionController.getAuctionById);

/**
 * @swagger
 * /api/v1/auction/{pId}:
 *   post:
 *     summary: Add auction
 *     description: Add a new auction for a product.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: pId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to add auction.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Auction'
 *     responses:
 *       200:
 *         description: Auction added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/:pId", authCheck, auctionController.addAuction);

/**
 * @swagger
 * /api/v1/auction/bid/{aId}:
 *   get:
 *     summary: Get bidders
 *     description: Retrieve all bidders for an auction by auction ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the auction to retrieve bidders.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Bidder'
 *       500:
 *         description: Internal server error
 *   post:
 *     summary: Bid auction
 *     description: Bid an auction by auction ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the auction to bid.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               bidAmount:
 *                 type: number
 *     responses:
 *       200:
 *         description: Bid placed successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router
  .route("/bid/:aId")
  .get(authCheck, auctionController.getBidders)
  .post(authCheck, auctionController.bidAuction);

/**
 * @swagger
 * /api/v1/auction/calculate/{aId}:
 *   get:
 *     summary: Decide auction winner
 *     description: Decide the winner of an auction by auction ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: aId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the auction to decide winner.
 *     responses:
 *       200:
 *         description: Auction winner decided successfully
 *       500:
 *         description: Internal server error
 */
router.get("/:aId", authCheck, auctionController.decideAuctionWinner);

module.exports = router;
