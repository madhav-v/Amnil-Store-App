const UserModel = require("../models/user.model");
const Joi = require("joi");
const pool = require("../config/mongoose.config");
class UserService {
  validatedata = async (data) => {
    try {
      let schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
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
  registerUser = async (data) => {
    try {
      const query = `
        INSERT INTO users (name, email, password, location_type, coordinates)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *
      `;
      const values = [
        data.name,
        data.email,
        data.password,
        data.location.type,
        data.location.coordinates,
      ];
      const result = await pool.query(query, values);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };
  getUserByEmail = async (email) => {
    try {
      const query = "SELECT * FROM users WHERE email = $1";
      const result = await pool.query(query, [email]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };

  getUserById = async (id) => {
    try {
      const query = "SELECT * FROM users WHERE id = $1";
      const result = await pool.query(query, [id]);
      return result.rows[0];
    } catch (error) {
      throw error;
    }
  };
}
const userSvc = new UserService();
module.exports = userSvc;
