var appRoot = require('app-root-path');
var winston = require('winston');



module.exports = function () {
  var options = {
    rtBuilderErrFile: {
      level: 'error',
      filename: `${appRoot}/logs/rtbuilder-err.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    communeErrFile: {
      level: 'error',
      filename: `${appRoot}/logs/commune-err.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },

    xBuilderErrFile: {
      level: 'error',
      filename: `${appRoot}/logs/xbuilder-err.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },

    appInfoFile: {
      level: 'info',
      filename: `${appRoot}/logs/iotglue-info.log`,
      handleExceptions: true,
      json: true,
      maxsize: 5242880, // 5MB
      maxFiles: 5,
      colorize: false,
    },
    console: {
      level: 'debug',
      handleExceptions: true,
      json: false,
      colorize: true,
    },
  };



  winston.loggers.add('clogger', {
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
      winston.format.splat(),
      winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
      new winston.transports.File(options.communeErrFile),
      new winston.transports.File(options.appInfoFile),
      new winston.transports.Console(options.console)
    ],
  });

  winston.loggers.add('xlogger', {
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
      winston.format.splat(),
      winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
      new winston.transports.File(options.xBuilderErrFile),
      new winston.transports.File(options.appInfoFile),
      new winston.transports.Console(options.console)
    ],
  });


  winston.loggers.add('rtlogger', {
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.simple(),
      winston.format.splat(),
      winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`)
    ),
    transports: [
      new winston.transports.File(options.rtBuilderErrFile),
      new winston.transports.File(options.appInfoFile),
      new winston.transports.Console(options.console)
    ],
  });


}
