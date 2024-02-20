const router = require("express").Router();
const storeCtrl = require("../controllers/store.controller");
const authCheck = require("../middleware/auth.middleware");
const uploader = require("../middleware/uploader.middleware");

const uploadPath = (req, res, next) => {
  req.uploadPath = "./public/store/";
  next();
};
router
  .route("/")
  .post(authCheck, uploadPath, uploader.single("logo"), storeCtrl.createStore);
router.post(
  "/addProducts",
  authCheck,
  uploadPath,
  uploader.array("images"),
  storeCtrl.addProductToStore
);
router
  .route("/:id")
  .put(authCheck, uploadPath, uploader.single("image"), storeCtrl.updateStore)
  .get(authCheck, storeCtrl.listAllProductsOfStore);

module.exports = router;
