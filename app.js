
require('./utils/logger')();
const express = require('express');
const winston = require('winston');
const bodyParser = require('body-parser');
const app = express();
const routes = require('./routes');
const config = require('./commons/app-config.json');
const eurekaHelper = require('./utils/eureka-helper');
const swaggerConfig = require('./utils/swagger-config');
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./commons/swagger.json');
const clogger = winston.loggers.get('clogger');
const configHelper = require('./utils/config-helper');
const http = require('http');
const https = require('https');
const fs = require('fs');

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const swaggerJsdoc = require("swagger-jsdoc");

const options = {
   // key: fs.readFileSync('src/ssl/mutual/server-private.key'),
   // cert: fs.readFileSync('src/ssl/mutual/server-signed.cer'),
   // ca: fs.readFileSync('src/ssl/mutual/ca.pem'),
      key: fs.readFileSync('src/ssl/server-key.pem'),
      cert: fs.readFileSync('src/ssl/server-crt.pem'),
      ca: fs.readFileSync('src/ssl/ca-crt.pem'),

    rejectUnauthorized: false
};

app.io = require('socket.io')();

// Create HTTP Server
var server = http.createServer(app);
app.io.attach(server);

// Create HTTPS Server
//  var httpsServer = https.createServer(options, app);
//  app.io.attach(httpsServer);

var db = require('./utils/mongo-connector');
var cors = require('cors');





app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => res.send('rtbuilder service running'))


//Below code is for swagger documentation
const specs = swaggerJsdoc(swaggerConfig.swaggerOptions);

app.use('/iotglueapi', routes);
app.use('/api-docs', swaggerUi.serve);
//app.get('/api-docs',swaggerUi.setup(specs, {explorer: true}));

app.get('/api-docs', swaggerUi.setup(swaggerDocument));


db.establishConnection();
configHelper.addConfigFile();
//eurekaHelper.registerWithEureka('rtbuilder-service', app.get("port"));

// Listen to HTTP Server
server.listen(app.get("port"), () =>
clogger.log("info", "app -> iotglue services listening on port -> %s", app.get("port")));

// Listen to HTTPS Server
// httpsServer.listen(app.get("port"), () =>
// clogger.log("info", "app -> iotglue services listening on port -> %s", app.get("port")));

module.exports = { app }
