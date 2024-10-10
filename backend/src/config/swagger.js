const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

// Swagger definition
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0", // Specify the OpenAPI version
    info: {
      title: "Inventory API", // Title of your API
      version: "1.0.0", // Version of the API
      description: "API documentation for the Inventory system",
      contact: {
        name: "Your Name",
        email: "your-email@example.com"
      },
      license: {
        name: "Apache 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0.html"
      }
    },
    servers: [
      {
        url: "http://localhost:4000/v1" // API server base URL
      }
    ]
  },
  apis: ["./src/routes/v1/*.js"] // Path to your API routes for auto-documentation
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);

module.exports = {
  swaggerDocs,
  swaggerUi
};
