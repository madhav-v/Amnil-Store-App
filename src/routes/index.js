const app = require("express").Router();
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");

app.use("/auth", authRoutes);
app.use("/product", productRoutes);

module.exports = app;
