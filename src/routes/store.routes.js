const router = require("express").Router();
const storeCtrl = require("../controllers/store.controller");
const authCheck = require("../middleware/auth.middleware");
const uploader = require("../middleware/uploader.middleware");

const uploadPath = (req, res, next) => {
  req.uploadPath = "./public/store/";
  next();
};
/**
 * @swagger
 * /api/v1/store:
 *   post:
 *     summary: Create a new store
 *     description: Create a new store with provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               logo:
 *                 type: string
 *                 format: binary
 *               type:
 *                 type: string
 *     responses:
 *       200:
 *         description: Store created successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 *   get:
 *     summary: Get all stores
 *     description: Retrieve all stores.
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
 *                 $ref: '#/components/schemas/Store'
 *       500:
 *         description: Internal server error
 */
router
  .route("/")
  .post(authCheck, uploadPath, uploader.single("logo"), storeCtrl.createStore)
  .get(authCheck, storeCtrl.getAllStores);

/**
 * @swagger
 * /api/v1/store/near:
 *   get:
 *     summary: Get nearby stores
 *     description: Retrieve nearby stores.
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
 *                 $ref: '#/components/schemas/Store'
 *       500:
 *         description: Internal server error
 */
router.get("/near", authCheck, storeCtrl.getNearByStores);

/**
 * @swagger
 * /api/v1/store/addProducts:
 *   post:
 *     summary: Add products to store
 *     description: Add products to a store with provided details.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Products added successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.post(
  "/addProducts",
  authCheck,
  uploadPath,
  uploader.array("images"),
  storeCtrl.addProductToStore
);

/**
 * @swagger
 * /api/v1/store/{id}:
 *   put:
 *     summary: Update a store
 *     description: Update an existing store by ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the store to update.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Store updated successfully
 *       400:
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.put(
  "/:id",
  authCheck,
  uploadPath,
  uploader.single("image"),
  storeCtrl.updateStore
);

module.exports = router;
