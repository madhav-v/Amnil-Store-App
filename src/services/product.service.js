const ProductModel = require("../models/product.model");
const Joi = require("joi");

class ProductService {
  productValidate = async (data) => {
    try {
      let schema = Joi.object({
        name: Joi.string().min(3).required(),
        categories: Joi.string(),
        detail: Joi.string(),
        price: Joi.number().min(1).required(),
        images: Joi.array().items(Joi.string()),
        sellerId: Joi.string(),
        stock: Joi.number(),
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

  getAllProducts = async () => {
    try {
      let data = await ProductModel.find()
        .populate("sellerId")
        .sort({ _id: -1 });
      return data;
    } catch (exception) {
      console.log(exception);
      throw { status: 500, msg: "Query execution failed." };
    }
  };

  getAllCount = async (filter = {}) => {
    return await ProductModel.count(filter);
  };

  createProduct = async (data) => {
    try {
      let product = new ProductModel(data);
      return await product.save();
    } catch (exception) {
      console.log(exception);
      throw {
        status: 500,
        msg: "DB Query failed",
      };
    }
  };

  updateProduct = async (data, id) => {
    try {
      let response = await ProductModel.findByIdAndUpdate(id, { $set: data });
      return response;
    } catch (except) {
      throw except;
    }
  };

  getProductById = async (id) => {
    try {
      let product = await ProductModel.findById(id).populate("sellerId");
      if (product) {
        return product;
      } else {
        throw { status: 404, msg: "Product does not exists" };
      }
    } catch (err) {
      console.log(err);
      throw err;
    }
  };

  deleteProductById = async (id) => {
    try {
      let delResponse = await ProductModel.findByIdAndDelete(id);
      if (delResponse) {
        return delResponse;
      } else {
        throw {
          status: 404,
          msg: "Product has been already deleted or does not exists",
        };
      }
    } catch (except) {
      throw except;
    }
  };

  getProductByFilter = async (filter) => {
    try {
      let response = await ProductModel.find(filter)
        .populate("sellerId")
        .sort({ _id: -1 });
      return response;
    } catch (exception) {
      throw exception;
    }
  };
}

const prodSvc = new ProductService();
module.exports = prodSvc;
