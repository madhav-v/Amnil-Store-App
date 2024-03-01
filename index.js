const http = require("http");
const express = require("express");
const app = express();
require("./src/config/mongoose.config");
const routes = require("./src/routes");
const logger = require("./src/config/logger.config");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");
const swaggerOptions = require("./src/config/swagger.config");
app.use(express.json());
app.use(
  express.urlencoded({
    extended: false,
  })
);
app.use("/api/v1", routes);
const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
const server = http.createServer(app);

app.use((req, res, next) => {
  next({ status: 404, msg: "Not found" });
});
app.use((error, req, res, next) => {
  let status = error && error.status ? error.status : 500;
  let msg = error && error.msg ? error.msg : "Internal server error..";
  console.log(error);

  res.status(status).json({
    result: null,
    status: false,
    msg: msg,
    meta: null,
  });
});
server.listen(3005, "localhost", (err) => {
  if (err) {
    console.log("Error listening to port 3005");
  } else {
    console.log("Server is listening to port 3005");
    console.log("Press CTRL+C to disconnect server");
    logger.info("Connected to server on port 3005");
  }
});
