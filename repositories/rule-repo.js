var mongoDB = require('../utils/mongo-connector');
const { ObjectId } = require('mongodb');


const winston = require('winston');
const rtlogger = winston.loggers.get('rtlogger');


/**
 * @author Rakshith S R
 * @description repo : get All Rules
 * @returns rules
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllRules = async () => {

  var conn = mongoDB.getconnection();

  let rules = await conn.collection('rules').find({}).toArray();
  rtlogger.log("info", "repo -> getAllRules -> rules : %s", JSON.stringify(rules));
  return rules;
}


/**
 * @author Rakshith S R
 * @description repo : getAllRulesWithPagination
 * @param skipValue
 * @param limitValue
 * @returns rules
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllRulesWithPagination = async (skipValue, limitValue) => {

  var conn = mongoDB.getconnection();
  let rules = await conn.collection('rules').find({}).skip(skipValue).limit(limitValue).toArray();
  rtlogger.log("info", "repo -> getAllRulesWithPagination -> rules : %s", JSON.stringify(rules));
  return rules;
}

/**
 * @author Rakshith S R
 * @description repo : get Rule By Id
 * @param ruleId
 * @returns rules
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getRuleById = async (ruleId) => {

  var conn = mongoDB.getconnection();

  let matchObj = { $match: { ruleId: ruleId } };
  let lookupObj = { $lookup: {localField:'sourceId', from:'sources', foreignField:'sourceId', as:'sourceIddetails'}};
  let unwindObj = { "$unwind": "$sourceIddetails" };
  let projectObj = { 
    "$project": {
      "description":1,
      "nodeType":1,
      "source":"$sourceIddetails.name",
      "sourceId":1,
      "type":1,
      "templateBased":1,
      "status":1,
      "topicOrUri":1,
      "createdBy":1,
      "name":1,
      "statusUpdateComment":1,
      "attributeKeysDataType":1,
      "simpleExp":1,
      "ruleId":1,
      "createdOn":1

    }
  };
  let rule = await conn.collection('rules').aggregate([ matchObj, lookupObj, unwindObj, projectObj]).toArray();
 // let rule = await conn.collection('rules').findOne({ ruleId: ruleId });
  rtlogger.log("info", "repo -> getRuleById -> rule : %s", JSON.stringify(rule));
  let rules = rule[0];
  return rules;
}


/**
 * @author Rakshith S R
 * @description repo : getRule With Script By Id
 * @param ruleId
 * @returns rules
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getRuleWithScriptById = async (ruleId) => {

  var conn = mongoDB.getconnection();


  let matchObj = { $match: { ruleId: ruleId } };
  let lookupObj = { $lookup: { "localField": "script", "from": "scripts", "foreignField": "scriptId", "as": "scriptForRule" } }
  let unwindObj = { $unwind: "$scriptForRule" };
  let lookupObj1 = { $lookup: {localField:'sourceId', from:'sources', foreignField:'sourceId', as:'sourceIddetails'}};
  let unwindObj1 = { "$unwind": "$sourceIddetails" };
  let projectObj = { 
    "$project": {
      "description":1,
      "sourceId":1,
      "type":1,
      "templateBased":1,
      "status":1,
      "topicOrUri":1,
      "createdBy":1,
      "name":1,
      "statusUpdateComment":1,
      "attributeKeysDataType":1,
      "script":1,
      "ruleId":1,
      "createdOn":1,
      "scriptForRule":1,
      "source": "$sourceIddetails.name"
    }
  };

  let rules = await conn.collection('rules').aggregate([matchObj, lookupObj, unwindObj, lookupObj1,unwindObj1,projectObj]).toArray();
  let ruleWithScript = rules[0];
  rtlogger.log("info", "repo -> getRuleWithScriptById -> ruleWithScript : %s", JSON.stringify(ruleWithScript));
  return ruleWithScript;
}


/**
 * @author Rakshith S R
 * @description repo : create Rule
 * @param ruleRequest
 * @returns ruleResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.createRule = async (ruleRequest) => {
  var conn = mongoDB.getconnection();
  let ruleResponse = {};

  let ruleResponseObj = await conn.collection('rules').insertOne(ruleRequest);
  ruleResponse = ruleResponseObj.ops[0];
  rtlogger.log("info", "repo -> createRule -> ruleResponse : %s", JSON.stringify(ruleResponse));
  return ruleResponse;

}

/**
 * @author Rakshith S R
 * @description repo : update Rule By Id
 * @param ruleRequest
 * @param id
 * @returns ruleResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.updateRuleById = async (id, ruleRequest) => {
  var conn = mongoDB.getconnection();
  const query = { ruleId: id };
  const updateRequest = { $set: ruleRequest };
  const options = { returnOriginal: false };

  let ruleResponseObj = await conn.collection('rules').findOneAndUpdate(query, updateRequest, options);
  rtlogger.log("info", "repo -> updateRuleById -> ruleResponse : %s", JSON.stringify(ruleResponseObj.value));

  let ruleResponse = ruleResponseObj.value;
  return ruleResponse;

}

/**
 * @author Rakshith S R
 * @description repo : delete Rule By Id
 * @param id
 * @returns null
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.deleteRuleById = async (id) => {
  var conn = mongoDB.getconnection();
  rtlogger.log("info", "repo -> deleteRuleById -> id : %s", id);
  return conn.collection('rules').deleteOne({ ruleId: id });

}



/**
 * @author Rakshith S R
 * @description repo :checks script exists or not
 * @param ruleId
 * @returns isScriptExists
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.isScriptExists = async (ruleId) => {

  var conn = mongoDB.getconnection();
  let type = "script";
  let isScriptExists = true;
  let query = { $and: [{ ruleId: { $eq: ruleId } }, { type: { $eq: type } }] };
  let rule = await conn.collection('rules').findOne(query);
  rtlogger.log("info", "repo ->tttt isScriptExists -> rule : %s", JSON.stringify(rule));
  if (!rule) { isScriptExists = false; }
  return isScriptExists;

}




/**
 * @author Rakshith S R
 * @description repo : getRuleForRightPanelById Payload type
 * @param ruleId 
 * @returns ruleForRightPanel
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getRuleForRightPanelById = async (ruleId) => {

  rtlogger.log("info", "repo -> getRuleForRightPanelById -> ruleId : %s", ruleId);

  var conn = mongoDB.getconnection();

  let matchObj = { $match: { ruleId: ruleId } };
  let lookupObj = { $lookup: { "localField": "sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceForRule" } }
  let unwindObj = { $unwind: "$sourceForRule" };
  let projectObjFirst = { $project: { "name": 1, "description": 1, "topicOrUri": 1, "type": 1, "simpleExp": 1, "complexExp": 1, "status": 1, "sourceId": 1, "createdBy": 1, "createdOn": 1, "modifiedBy": 1, "modifiedOn": 1, "sourceName": "$sourceForRule.name" } };

  let projectForRightPanel = {
    $project:
    {
      "section_1.name": "$name",
      "section_1.description": "$description",
      "section_2": { "section" : "$section"},
      "section_3.sourceName": "$sourceName",
      "section_3.topicOrUri": "$topicOrUri",
      "section_3.typeOfRule": "$type",
      /**  "section_1.simpleExp": "$simpleExp",
       "section_1.complexExp": "$complexExp",
       "section_1.status": "$status",*/
      "section_4.createdBy": "$createdBy",
      "section_4.createdOn": "$createdOn",
      "section_4.modifiedBy": "$modifiedBy",
      "section_4.modifiedOn": "$modifiedOn"
    }
  };


  let rules = await conn.collection('rules').aggregate([matchObj, lookupObj, unwindObj, projectObjFirst, projectForRightPanel]).toArray();
  rtlogger.log("info", "repo -> getRuleForRightPanelById -> rules : %s", JSON.stringify(rules));

  let ruleForRightPanel = rules[0];
  return ruleForRightPanel;
}





/**
 * @author Rakshith S R
 * @description repo : getRuleWithScriptForRightPanelById 
 * @param ruleId 
 * @returns ruleForRightPanel
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getRuleWithScriptForRightPanelById = async (ruleId) => {

  rtlogger.log("info", "repo -> getRuleWithScriptForRightPanelById -> ruleId : %s", ruleId);

  var conn = mongoDB.getconnection();

  let matchObj = { $match: { ruleId: ruleId } };
  let scriptLookupObj = { $lookup: { "localField": "script", "from": "scripts", "foreignField": "scriptId", "as": "scriptForRule" } };
  let unwindScriptObj = { $unwind: "$scriptForRule" };
  let sourceLookupObj = { $lookup: { "localField": "sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceForRule" } }
  let unwindSourceObj = { $unwind: "$sourceForRule" };
  let projectObjFirst = { $project: { "name": 1, "description": 1, "topicOrUri": 1, "type": 1, "scriptForRule.scriptForView": 1, "status": 1, "sourceId": 1, "createdBy": 1, "createdOn": 1, "modifiedBy": 1, "modifiedOn": 1, "sourceName": "$sourceForRule.name" } };

  let projectForRightPanel = {
    $project:
    {
      "section_1.name": "$name",
      "section_1.description": "$description",
      "section_2": { "section" : "$section"},
      "section_3.sourceName": "$sourceName",
      "section_3.topicOrUri": "$topicOrUri",
      "section_3.typeOfRule": "$type",
      /**  "section_1.scriptForView": "$scriptForRule.scriptForView",
       "section_1.status": "$status", */
      "section_4.createdBy": "$createdBy",
      "section_4.createdOn": "$createdOn",
      "section_4.modifiedBy": "$modifiedBy",
      "section_4.modifiedOn": "$modifiedOn"
    }
  };


  let rules = await conn.collection('rules').aggregate([matchObj, scriptLookupObj, unwindScriptObj, sourceLookupObj, unwindSourceObj, projectObjFirst, projectForRightPanel]).toArray();
  rtlogger.log("info", "repo -> getRuleWithScriptForRightPanelById -> rules : %s", JSON.stringify(rules));

  let ruleForRightPanel = rules[0];
  return ruleForRightPanel;
}


/**
 * @author Rakshith S R
 * @description repo : get Filtered Rules
 * @param ruleId 
 * @returns rule
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getFilteredRules = async (sourceId, topicOrUri, status,templateBased) => {

  rtlogger.log("info", "repo -> getFilteredRules -> templateBased : %s", templateBased);
  var conn = mongoDB.getconnection();

  let filterObj;

  filterObj = { $and: [{ sourceId: { $eq: sourceId } }, { status: { $eq: status } }, { topicOrUri: { $eq: topicOrUri } },{ templateBased: { $eq: templateBased } }] };

  if(templateBased === "ALL"){
     filterObj = { $and: [{ sourceId: { $eq: sourceId } }, { status: { $eq: status } }, { topicOrUri: { $eq: topicOrUri } }] };
  }
 
  let projObj = { type: 1, templateBased: 1, status: 1, name: 1, ruleId: 1, _id: 0 };
  let rule = await conn.collection('rules').find(filterObj).project(projObj).toArray();
  rtlogger.log("info", "repo -> getFilteredRules -> rule : %s", JSON.stringify(rule));
  return rule;
}