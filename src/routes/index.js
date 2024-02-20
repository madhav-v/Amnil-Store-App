const app = require("express").Router();
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const cartRoutes = require("./cart.routes");
const storeRoutes = require("./store.routes");
const auctionRoutes = require("./auction.routes");

app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/store", storeRoutes);
app.use("/auction", auctionRoutes);

module.exports = app;
