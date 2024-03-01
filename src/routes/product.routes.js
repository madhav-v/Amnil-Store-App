const router = require("express").Router();
const productCtrl = require("../controllers/product.controller");
const authCheck = require("../middleware/auth.middleware");
const uploader = require("../middleware/uploader.middleware");

/**
 * @swagger
 * /api/v1/product:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of all products.
 *     responses:
 *       200:
 *         description: A list of products.
 */
router.get("/", authCheck, productCtrl.getAllProducts);

/**
 * @swagger
 * /api/v1/product:
 *   post:
 *     summary: Create a new product
 *     description: Create a new product with the provided details.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               categories:
 *                 type: string
 *               detail:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post(
  "/",
  authCheck,
  uploader.array("images"),
  productCtrl.createProduct
);

/**
 * @swagger
 * /api/v1/product/search:
 *   get:
 *     summary: Search products
 *     description: Search for products based on specified criteria.
 *     parameters:
 *       - in: query
 *         name: keyword
 *         schema:
 *           type: string
 *         description: Keyword to search for in product names.
 *     responses:
 *       200:
 *         description: A list of products matching the search criteria.
 */
router.get("/search", productCtrl.searchAllProducts);

/**
 * @swagger
 * /api/v1/product/{id}:
 *   put:
 *     summary: Update a product
 *     description: Update an existing product with the provided details.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               categories:
 *                 type: string
 *               detail:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get a product by ID
 *     description: Retrieve detailed information about a specific product.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to retrieve.
 *     responses:
 *       200:
 *         description: Detailed information about the product.
 */
router
  .route("/:id")
  .put(authCheck, uploader.single("image"), productCtrl.updateProduct)
  .get(authCheck, productCtrl.getProductById);

/**
 * @swagger
 * /api/v1/product/{id}:
 *   delete:
 *     summary: Delete a product
 *     description: Delete an existing product by ID.
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to delete.
 *     responses:
 *       200:
 *         description: Product deleted successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.delete("/:id", authCheck, productCtrl.deleteProduct);

module.exports = router;
