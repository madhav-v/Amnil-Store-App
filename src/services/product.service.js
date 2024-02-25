const CartModel = require("../models/cart.model");
const ProductModel = require("../models/product.model");
const Joi = require("joi");
const pool = require("../config/mongoose.config");

class ProductService {
  productValidate = async (data) => {
    try {
      let schema = Joi.object({
        name: Joi.string().min(3).required(),
        categories: Joi.string(),
        detail: Joi.string(),
        price: Joi.number().min(1).required(),
        images: Joi.array().items(Joi.string()),
        store_id: Joi.string(),
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
      const query = "SELECT * FROM products ORDER BY id DESC";
      const { rows } = await pool.query(query);
      return rows;
    } catch (exception) {
      console.log(exception);
      throw { status: 500, msg: "Query execution failed." };
    }
  };

  getAllCount = async (filter = {}) => {
    try {
      const query = `SELECT COUNT(*) FROM products WHERE ${this.generateFilterConditions(
        filter
      )}`;
      const { rows } = await pool.query(query);
      return parseInt(rows[0].count);
    } catch (error) {
      throw error;
    }
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
      const query = `
        UPDATE products
        SET name = $1, categories = $2, detail = $3, price = $4, images = $5, stock = $6
        WHERE id = $7`;
      const values = [
        data.name,
        data.categories,
        data.detail,
        data.price,
        data.images,
        data.stock,
        id,
      ];
      await pool.query(query, values);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  getProductById = async (id) => {
    try {
      const query = `SELECT * FROM products WHERE id = $1`;
      const { rows } = await pool.query(query, [id]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  };

  deleteProductById = async (id) => {
    try {
      const query = `DELETE FROM products WHERE id = $1`;
      await pool.query(query, [id]);
      return { success: true };
    } catch (error) {
      throw error;
    }
  };

  getProductByFilter = async (filter) => {
    try {
      const query = `
        SELECT *
        FROM products
        WHERE ${this.generateFilterConditions(filter)}
        ORDER BY id DESC`;
      const { rows } = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  };
  generateFilterConditions(filter) {
    let conditions = [];

    if (filter.$or && Array.isArray(filter.$or)) {
      filter.$or.forEach((condition) => {
        for (const key in condition) {
          if (key === "name" || key === "detail") {
            conditions.push(`${key} ILIKE '%${condition[key]}%'`);
          }
        }
      });
    }

    return conditions.join(" OR ");
  }

  addToCart = (data) => {
    try {
      let cart = new CartModel(data);
      return cart.save();
    } catch (exception) {
      throw exception;
    }
  };
}

const prodSvc = new ProductService();
module.exports = prodSvc;
