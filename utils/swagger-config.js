// Swagger set up
const swaggerOptions = {
  swaggerDefinition: {
    openapi: "3.0.0",
    info: {
      title: "IOTGlue-Component API's",
      version: "1.0.0",
      description:
        "IOTGlue Module API's",
      license: {
        name: "Torry Harris",
        url: "https://www.torryharris.com/"
      }
    },
    servers: [
      {
        url: "http://localhost:3000/iotglueapi"
      }
    ]
  },
  apis: ['/../routes/index.js']
};

module.exports.swaggerOptions = swaggerOptions;