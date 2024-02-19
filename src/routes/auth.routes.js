const app = require("express").Router();
const authCtrl = require("../controllers/auth.controller");

app.post("/login", authCtrl.login);

app.post("/register", authCtrl.register);
module.exports = app;
