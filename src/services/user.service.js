const UserModel = require("../models/user.model");
const Joi = require("joi");

class UserService {
  validatedata = async (data) => {
    try {
      let schema = Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        role: Joi.string().valid("admin", "seller", "customer").required(),
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
      let user = new UserModel(data);
      return await user.save();
    } catch (exception) {
      throw exception;
    }
  };
  getUserByEmail = async (email) => {
    try {
      let user = await UserModel.findOne({
        email: email,
      });
      if (user) {
        return user;
      } else {
        throw "User does not exists";
      }
    } catch (except) {
      throw except;
    }
  };

  getUserById = async (id) => {
    try {
      let userDetail = await UserModel.findById(id);
      return userDetail;
    } catch (err) {
      throw err;
    }
  };
}
const userSvc = new UserService();
module.exports = userSvc;
