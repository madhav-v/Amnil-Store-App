const dotenv = require("dotenv");
dotenv.config();
const bcrypt = require("bcryptjs");
const userSvc = require("../services/user.service");
const helpers = require("../utilities/helpers");
const jwt = require("jsonwebtoken");

class AuthController {
  login = async (req, res, next) => {
    try {
      let payload = req.body;
      if (!payload.email || !payload.password) {
        next({ status: 400, msg: "Credentials required" });
      }
      let userDetail = await userSvc.getUserByEmail(payload.email);
      if (!userDetail) {
        return res.status(403).json({ msg: "User not found" });
      }
      const passwordMatch = bcrypt.compareSync(
        payload.password,
        userDetail.password
      );
      if (!passwordMatch) {
        return res.status(403).json({ msg: "Incorrect password" });
      }

      // Generate JWT tokens
      const accessToken = jwt.sign(
        { userId: userDetail.id },
        process.env.JWT_SECRET,
        { expiresIn: "3h" }
      );
      const refreshToken = jwt.sign(
        { userId: userDetail.id },
        process.env.JWT_SECRET,
        { expiresIn: "5d" }
      );

      // Send response with user details and tokens
      res.json({
        result: {
          data: userDetail,
          token: {
            accessToken: accessToken,
            accessType: "Bearer",
            refreshToken: refreshToken,
          },
        },
        status: true,
        msg: "You are logged in",
      });
    } catch (exception) {
      console.log(exception);
      next({ status: 400, msg: "Query Exception. View console" });
    }
  };

  register = async (req, res, next) => {
    try {
      let registerData = req.body;
      userSvc.validatedata(registerData);
      registerData.password = bcrypt.hashSync(registerData.password, 10);

      await userSvc.registerUser(registerData);

      res.json({
        result: registerData,
        msg: "User registered successfully.",
        status: true,
      });
    } catch (exception) {
      console.log(exception);
      next(exception);
    }
  };
}

const authCtrl = new AuthController();
module.exports = authCtrl;
