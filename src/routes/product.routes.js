const router = require("express").Router();
const productCtrl = require("../controllers/product.controller");
const authCheck = require("../middleware/auth.middleware");
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
    uploadPath,
    uploader.array("images"),
    productCtrl.createProduct
  );
router.get("/search", productCtrl.searchAllProducts);
router
  .route("/:id")
  .put(
    authCheck,
    uploadPath,
    uploader.single("image"),
    productCtrl.updateProduct
  )
  .get(authCheck, productCtrl.getProductById)
  .delete(authCheck, productCtrl.deleteProduct);

module.exports = router;
