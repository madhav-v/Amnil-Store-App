const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Store APP",
      version: "1.0.0",
      description: "Description of API of Store App",
    },
    servers: [
      {
        url: "http://localhost:3005",
      },
    ],
  },
  apis: ["./src/routes/*.js"],
};

module.exports = swaggerOptions;
