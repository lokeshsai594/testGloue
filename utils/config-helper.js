const winston = require('winston');
const clogger = winston.loggers.get('clogger');
const axios = require('axios');
var fs = require('fs');
var path = require('path');
const https = require('https');

const baseUrl = "http://127.0.0.1:8090";  // Need to change this accordingly based on environment/instance used
const configServiceUrl = baseUrl + "/config-application/rest/fetchconfig/nodeservice-web";

exports.addConfigFile = async function () {

    let configDir = process.cwd() + '/src/commons';
    let configFile = configDir + '/app-config.json';
    let configEmptyFile = configDir + '/configEmpty.json';


    let isConfigExists = fs.existsSync(configEmptyFile);
    clogger.log("info", "addConfigFile -> isConfigExists ->  %s", isConfigExists);

    if (!isConfigExists) {
        let configResp = await getConfig(configServiceUrl);
        clogger.log("info", "addConfigFile -> response ->  %s", JSON.stringify(configResp));
        if (configResp !== null) {
            clogger.log("info", "addConfigFile -> writeFile ->  write to config file ->%s", path.basename(configFile));
            writeFile(configFile, configResp);
        }
        clogger.log("info", "addConfigFile -> writeFile ->  write to empty file ->%s", path.basename(configEmptyFile));
        writeFile(configEmptyFile, {});
    }
}



async function getConfig(configServiceUrl) {
    try {
        let configDetails = null;

        const agent = new https.Agent({  
            rejectUnauthorized: false
          });

        //let response = await axios.get(configServiceUrl,{ httpsAgent: agent });
        let response = await axios.get(configServiceUrl);
        clogger.log("info", "config-helper -> getConfig -> status code %s", response.status);

        if (response.status === 202) {
            clogger.log("info", "config-helper -> value for config key ->  %s", response.data['nodeservice-web'].config);
            configDetails = response.data['nodeservice-web'].config;
        }
        return configDetails;
    } catch (error) {
        clogger.log("error", "config-helper -> getConfig ->  %s", error);

    }
}


function writeFile(file, value) {
    fs.writeFile(file, JSON.stringify(value, null, 4), (err, result) => {
        if (err) {
            clogger.log("error", "writeFile -> issue with writing into file ->  %s", JSON.stringify(err));
        } else {
            clogger.log("info", "writeFile -> Successfully Written to File -> name ->  %s", path.basename(file));
        }

    });
}