const Joi = require("joi");
const StoreModel = require("../models/store.model");
const ProductModel = require("../models/product.model");
const prodSvc = require("./product.service");

class StoreService {
  storeValidate = async (data) => {
    try {
      let schema = Joi.object({
        name: Joi.string().required(),
        type: Joi.string(),
        user: Joi.string().required(),
        logo: Joi.string().required(),
        location: Joi.object({
          type: Joi.string().required(),
          coordinates: Joi.array().items(Joi.number()).required(),
        }),
      });
      let response = schema.validate(data);
      if (response.error) {
        let msg = response.error.details[0].message;
        throw { status: 400, msg: msg };
      }
      return response.value;
    } catch (exception) {
      console.log(exception);
      throw exception;
    }
  };
  createScore = async (data) => {
    try {
      let store = new StoreModel(data);
      return await store.save();
    } catch (exception) {
      throw exception;
    }
  };
  updateStore = async (id, data) => {
    try {
      if (
        data.location &&
        data.location.coordinates &&
        Array.isArray(data.location.coordinates)
      ) {
        data.location.coordinates = data.location.coordinates.map((coord) =>
          parseFloat(coord)
        );
      }
      let storeDetail = await StoreModel.findByIdAndUpdate(id, { $set: data });
      return storeDetail;
    } catch (err) {
      throw err;
    }
  };
  listAllProductsOfStore = async (id) => {
    try {
      const store = await StoreModel.findById(id).populate("products");
      return store;
    } catch (exception) {
      throw exception;
    }
  };
  addProductToStore = async (id, data) => {
    try {
      let store = await StoreModel.findById(id);
      if (!store) {
        throw { status: 404, msg: "Store not found" };
      }
      const product = await prodSvc.createProduct(data);
      store.products.push(product._id);
      await store.save();
    } catch (exception) {
      throw exception;
    }
  };
  getAllStores = async () => {
    try {
      return await StoreModel.find();
    } catch (exception) {
      throw exception;
    }
  };
}

const storeSvc = new StoreService();
module.exports = storeSvc;
