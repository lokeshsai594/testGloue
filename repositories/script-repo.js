var mongoDB = require('../utils/mongo-connector');
const { ObjectId } = require('mongodb');


const winston = require('winston');
const rtlogger = winston.loggers.get('rtlogger');


/**
 * @author Rakshith S R
 * @description repo : get All Scripts
 * @returns scripts
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllScripts = async () => {

  var conn = mongoDB.getconnection();

  let scripts = await conn.collection('scripts').find({}).toArray();
  rtlogger.log("info", "repo -> getAllScripts -> scripts : %s", JSON.stringify(scripts));
  return scripts;
}


/**
 * @author Rakshith S R
 * @description repo : get Script By Id
 * @param scriptId
 * @returns script
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getScriptById = async (scriptId) => {

  var conn = mongoDB.getconnection();
  let script = await conn.collection('scripts').findOne({ _id: ObjectId(scriptId) });
  rtlogger.log("info", "repo -> getScriptById -> script : %s", JSON.stringify(script));
  return script;
}


/**
 * @author Rakshith S R
 * @description repo : scriptRequest
 * @returns scriptResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.createScript = async (scriptRequest) => {
  var conn = mongoDB.getconnection();
  let scriptResponse = {};

  let scriptResponseObj = await conn.collection('scripts').insertOne(scriptRequest);
  scriptResponse = scriptResponseObj.ops[0];
  rtlogger.log("info", "repo -> createScript -> scriptResponse : %s", JSON.stringify(scriptResponse));
  return scriptResponse;

}

/**
 * @author Rakshith S R
 * @description repo : update Script By Id
 * @param id
 * @param scriptRequest
 * @returns scriptResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.updateScriptById = async (id, scriptRequest) => {
  var conn = mongoDB.getconnection();
  const query = { _id: ObjectId(id) };
  const updateRequest = { $set: scriptRequest };
  const options = { returnOriginal: false };

  let scriptResponseObj = await conn.collection('scripts').findOneAndUpdate(query, updateRequest, options);
  rtlogger.log("info", "repo -> updateScriptById -> ruleResponse : %s", JSON.stringify(scriptResponseObj.value));

  let scriptResponse = scriptResponseObj.value;
  return scriptResponse;

}

/**
 * @author Rakshith S R
 * @description repo : delete Script By Id
 * @param scriptId
 * @returns scriptResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.deleteScriptById = async (scriptId) => {
  var conn = mongoDB.getconnection();
  rtlogger.log("info", "repo -> deleteScriptById -> scriptId : %s", scriptId);
  return conn.collection('rules').deleteOne({ _id: ObjectId(scriptId) });

}