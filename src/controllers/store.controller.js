const storeSvc = require("../services/store.service");
const prodSvc = require("../services/product.service");
const StoreModel = require("../models/store.model");
const UserModel = require("../models/user.model");

class StoreController {
  createStore = async (req, res, next) => {
    try {
      let data = req.body;
      let userId = req.authUser?.id;
      if (req.file) {
        data.logo = req.file.filename;
      }
      data.user = userId;
      let store = await storeSvc.storeValidate(data);
      await storeSvc.createScore(store);
      res.json({
        result: store,
        msg: "Store registered successfully.",
        status: true,
      });
    } catch (exception) {
      next(exception);
    }
  };

  addProductToStore = async (req, res, next) => {
    try {
      let data = req.body;
      if (req.files) {
        data.images = req.files.map((item) => {
          return item.filename;
        });
      }
      let id = data.store;
      let validated = await prodSvc.productValidate(data);
      let response = await storeSvc.addProductToStore(id, validated);
      res.json({
        result: response,
        msg: "Product created successfully",
        status: true,
        meta: null,
      });
    } catch (exception) {
      next(exception);
    }
  };
  updateStore = async (req, res, next) => {
    try {
      const storeId = req.params.id;
      const updatedData = req.body;
      console.log("storeId", storeId);
      console.log("data", updatedData);
      const store = await storeSvc.updateStore(storeId, updatedData);
      res.json({
        result: store,
        msg: "Store updated successfully.",
        status: true,
      });
    } catch (exception) {
      next(exception);
    }
  };
  listAllProductsOfStore = async (req, res, next) => {
    try {
      const storeId = req.params.id;
      const products = await storeSvc.listAllProductsOfStore(storeId);
      res.json({
        result: products,
        msg: "Products retrieved successfully.",
        status: true,
      });
    } catch (exception) {
      next(exception);
    }
  };
  getAllStores = async (req, res, next) => {
    try {
      const stores = await storeSvc.getAllStores();
      res.json({
        result: stores,
        msg: "Stores retrieved successfully.",
        status: true,
      });
    } catch (exception) {
      next(exception);
    }
  };
  getNearByStores = async (req, res, next) => {
    try {
      const userId = req.authUser.id;

      const maxDistance = 10000;

      const user = await UserModel.findById(userId);
      const userLocation = user.location;

      const stores = await StoreModel.find({
        location: {
          $near: {
            $geometry: {
              type: "Point",
              coordinates: userLocation.coordinates,
            },
            $maxDistance: maxDistance,
          },
        },
      });

      res.json({
        result: stores,
        msg: "Nearby stores retrieved successfully.",
        status: true,
      });
    } catch (exception) {
      next(exception);
    }
  };
}

const storeCtrl = new StoreController();
module.exports = storeCtrl;
