const express = require("express");
const cartController = require("../controllers/cart.controller");
const authCheck = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/v1/cart:
 *   get:
 *     summary: Get all carts
 *     description: Retrieve all carts.
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
 *                 $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Internal server error
 */
router.get("/", authCheck, cartController.getAllCarts);

/**
 * @swagger
 * /api/v1/cart/{userId}:
 *   get:
 *     summary: Get user cart
 *     description: Retrieve a user's cart by user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose cart to retrieve.
 *     responses:
 *       200:
 *         description: Successful operation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Cart'
 *       500:
 *         description: Internal server error
 */
router.get("/:userId", authCheck, cartController.getUserCart);

/**
 * @swagger
 * /api/v1/cart/{userId}/addToCart:
 *   post:
 *     summary: Add item to cart
 *     description: Add an item to a user's cart by user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to add item to cart.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               itemId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Item added to cart successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/:userId/addToCart", authCheck, cartController.addToCart);

module.exports = router;
