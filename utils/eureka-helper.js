
const Eureka = require('eureka-js-client').Eureka;
const eurekaHost = (process.env.EUREKA_CLIENT_SERVICEURL_DEFAULTZONE || '127.0.0.1');
const eurekaPort = 8761;
const hostName = (process.env.HOSTNAME || 'localhost');
const ipAddr = '127.0.0.1';
const logger = require('./logger');

exports.registerWithEureka = function (appName, PORT) {
  const client = new Eureka({
    instance: {
      app: appName,
      hostName: hostName,
      ipAddr: ipAddr,
      port: {
        '$': PORT,
        '@enabled': 'true',
      },
      vipAddress: appName,
      dataCenterInfo: {
        '@class': 'com.netflix.appinfo.InstanceInfo$DefaultDataCenterInfo',
        name: 'MyOwn',
      },
    },
    //retry 10 time for 3 minute 20 seconds.
    eureka: {
      host: eurekaHost,
      port: eurekaPort,
      servicePath: '/eureka/apps/',
      maxRetries: 10,
      requestRetryDelay: 2000,
    },
  })

  client.logger.level('debug')

  client.start((error) => {
    logger.log("info", error || "eureka-helper -> user service registered");
  });



  function exitHandler(options, exitCode) {
    if (options.cleanup) {
    }
    if (exitCode || exitCode === 0) console.log(exitCode);
    if (options.exit) {
      client.stop();
    }
  }

  client.on('deregistered', () => {
    process.exit();
    logger.log("info", "eureka-helper -> deregistered -> %s", eurekaHost);
  })

  client.on('started', () => {
    logger.log("info", "eureka-helper -> started -> %s", eurekaHost);

  })

  process.on('SIGINT', exitHandler.bind(null, { exit: true }));
};