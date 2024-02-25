const Joi = require("joi");
const StoreModel = require("../models/store.model");
const ProductModel = require("../models/product.model");
const prodSvc = require("./product.service");
const pool = require("../config/mongoose.config");

class StoreService {
  storeValidate = async (data) => {
    try {
      let schema = Joi.object({
        name: Joi.string().required(),
        type: Joi.string(),
        user: Joi.string().required(),
        logo: Joi.string().required(),
        location_type: Joi.string().required(),
        coordinates: Joi.array().items(Joi.number()).required(),
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
    const client = await pool.connect();
    try {
      const query = `
        INSERT INTO store (name, type, user_id, logo, location_type, coordinates)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `;
      const { name, type, user, logo, location_type, coordinates } = data;
      const values = [name, type, user, logo, location_type, coordinates];
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  };
  updateStore = async (id, data) => {
    const client = await pool.connect();
    try {
      const query = `
        UPDATE store 
        SET name = $1, type = $2, logo = $3, location_type = $4, coordinates = $5
        WHERE id = $6
        RETURNING *;
      `;
      const { name, type, logo, location_type, coordinates } = data;
      const values = [name, type, logo, location_type, coordinates, id];
      const result = await client.query(query, values);
      return result.rows[0];
    } finally {
      client.release();
    }
  };
  listAllProductsOfStore = async (id) => {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM store WHERE id = $1;
      `;
      const result = await client.query(query, [id]);
      return result.rows[0];
    } finally {
      client.release();
    }
  };
  addProductToStore = async (id, data) => {
    const client = await pool.connect();
    try {
      const { name, categories, detail, price, stock, images } = data;
      const query = `
        INSERT INTO products (name, categories, detail, price, stock, images, store_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *;
      `;
      const values = [name, categories, detail, price, stock, images, id];
      const result = await client.query(query, values);
      const product = result.rows[0];

      const updateQuery = `
        UPDATE store 
        SET products = array_append(products, $1)
        WHERE id = $2;
      `;
      await client.query(updateQuery, [product.id, id]);

      return product;
    } finally {
      client.release();
    }
  };
  getAllStores = async () => {
    const client = await pool.connect();
    try {
      const query = `
        SELECT * FROM store;
      `;
      const result = await client.query(query);
      return result.rows;
    } finally {
      client.release();
    }
  };
}

const storeSvc = new StoreService();
module.exports = storeSvc;
