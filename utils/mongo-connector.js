var MongoClient = require('mongodb').MongoClient;
const config = require('./../commons/app-config.json');
var assert = require('assert');
const logger = require('./logger');
const winston = require('winston');
const clogger = winston.loggers.get('clogger');


var url = config.mongoUrl;
var database = config.mongoDBname;

var connection = [];
// Create the database connection
establishConnection = function (callback) {
    

    MongoClient.connect(url,{ useUnifiedTopology: true }, { poolSize: 10 }, function (err, db) {
        assert.equal(null, err);

        connection = db.db(database);
        if (typeof callback === 'function' && callback)
            callback(connection)

    }

    )



}

function getconnection() {
    return connection
}

module.exports = {

    establishConnection: establishConnection,
    getconnection: getconnection
}