const express = require("express");
const orderController = require("../controllers/order.controller");
const authCheck = require("../middleware/auth.middleware");

const router = express.Router();

/**
 * @swagger
 * /api/v1/order:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve all orders.
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
 *                 $ref: '#/components/schemas/Order'
 *       500:
 *         description: Internal server error
 */
router.get("/", authCheck, orderController.getAllOrders);

/**
 * @swagger
 * /api/v1/order/{userId}/checkout:
 *   post:
 *     summary: Checkout order
 *     description: Checkout an order for a user by user ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user to checkout order.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     itemId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       200:
 *         description: Order checked out successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post("/:userId/checkout", authCheck, orderController.checkoutOrder);

module.exports = router;
