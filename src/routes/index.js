const app = require("express").Router();
const authRoutes = require("./auth.routes");
const productRoutes = require("./product.routes");
const cartRoutes = require("./cart.routes");
const orderRoutes = require("./order.routes");
const storeRoutes = require("./store.routes");
const auctionRoutes = require("./auction.routes");
const analyticsRoutes = require("./analytics.routes");

app.use("/auth", authRoutes);
app.use("/product", productRoutes);
app.use("/cart", cartRoutes);
app.use("/order", orderRoutes);
app.use("/store", storeRoutes);
app.use("/auction", auctionRoutes);
app.use("/analytics", analyticsRoutes);

module.exports = app;
