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

      if (bcrypt.compareSync(payload.password, userDetail.password)) {
        let accessToekn = jwt.sign(
          {
            userId: userDetail._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "3h",
          }
        );

        let refreshToken = jwt.sign(
          {
            userId: userDetail._id,
          },
          process.env.JWT_SECRET,
          {
            expiresIn: "5d",
          }
        );

        res.json({
          result: {
            data: userDetail,
            token: {
              accessToken: accessToekn,
              accessType: "Bearer",
              refreshToken: refreshToken,
            },
          },
          status: true,
          msg: "You are logged in",
        });
      } else {
        next({ status: 403, msg: "Your account has not been activated yet" });
      }
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
      registerData.activationToken = helpers.generateRandomString();

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
