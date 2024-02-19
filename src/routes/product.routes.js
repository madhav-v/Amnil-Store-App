const router = require("express").Router();
const productCtrl = require("../controllers/product.controller");
const authCheck = require("../middleware/auth.middleware");
const { checkPermission } = require("../middleware/permission.middleware");
const uploader = require("../middleware/uploader.middleware");

const uploadPath = (req, res, next) => {
  req.uploadPath = "./public/products/";
  next();
};
router
  .route("/")
  .get(authCheck, productCtrl.getAllProducts)
  .post(
    authCheck,
    checkPermission("seller"),
    uploadPath,
    uploader.array("images"),
    productCtrl.createProduct
  );
router.get("/search", productCtrl.searchAllProducts);
router
  .route("/:id")
  .put(
    authCheck,
    checkPermission("seller"),
    uploadPath,
    uploader.single("image"),
    productCtrl.updateProduct
  )
  .get(authCheck, checkPermission("seller"), productCtrl.getProductById)
  .delete(authCheck, checkPermission("seller"), productCtrl.deleteProduct);

module.exports = router;
