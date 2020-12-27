
var https = require('https'); 
var fs = require('fs');

const mutualHTTPAgent = new https.Agent({
    requestCert: true,
    rejectUnauthorized: false,
    cert: fs.readFileSync("src/ssl/diffcncerts/client-signed.cer"),
    key: fs.readFileSync("src/ssl/diffcncerts/client-private.key"),
    ca:fs.readFileSync("src/ssl/diffcncerts/ca.pem")
  });

  module.exports.mutualHTTPAgent = mutualHTTPAgent;