var mongoDB = require('./../utils/mongo-connector');
const { ObjectId } = require('mongodb');
const winston = require('winston');
const rtlogger = winston.loggers.get('rtlogger');


/**
 * @author Rakshith S R
 * @description repo :get All Actions
 * @returns actions
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllActions = async () => {

  var conn = mongoDB.getconnection();
  let actions = await conn.collection('actions').find({}).toArray();
  rtlogger.log("info", "repo -> getAllActions -> actions : %s", JSON.stringify(actions));
  return actions;
}


/**
 * @author Rakshith S R
 * @description repo :get All Actions With Pagination
 * @param skipValue
 * @param limitValue
 * @returns actions
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllActionsWithPagination = async (skipValue, limitValue) => {

  var conn = mongoDB.getconnection();
  let actions = await conn.collection('actions').find({}).skip(skipValue).limit(limitValue).toArray();
  rtlogger.log("info", "repo -> getAllActionsWithPagination -> actions : %s", JSON.stringify(actions));
  return actions;
}


/**
 * @author Rakshith S R
 * @description repo :create Action
 * @param actionRequest
 * @returns actionResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.createAction = async (actionRequest) => {
  var conn = mongoDB.getconnection();
  let actionResponse = {};

  let actionResponseObj = await conn.collection('actions').insertOne(actionRequest);
  actionResponse = actionResponseObj.ops[0];
  rtlogger.log("info", "repo -> createAction -> actionResponse : %s", JSON.stringify(actionResponse));
  return actionResponse;

}


/**
 * @author Rakshith S R
 * @description repo :update Action By Id
 * @param id
 * @param actionRequest
 * @returns actionResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.updateActionById = async (id, actionRequest) => {
  var conn = mongoDB.getconnection();
  const query = { actionId: id };
  const updateRequest = { $set: actionRequest };
  const options = { returnOriginal: false };

  let actionResponseObj = await conn.collection('actions').findOneAndUpdate(query, updateRequest, options);
  rtlogger.log("info", "repo -> updateActionById -> actionResponse : %s", JSON.stringify(actionResponseObj.value));

  let actionResponse = actionResponseObj.value;
  return actionResponse;

}


/**
 * @author Rakshith S R
 * @description repo :delete Action By Id
 * @param id
 * @returns actionResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.deleteActionById = async (id) => {
  var conn = mongoDB.getconnection();
  rtlogger.log("info", "repo -> deleteActionById -> id : %s", id);
  return await conn.collection('actions').deleteOne({ actionId: id });

}



exports.getActionById = async (actionId) => {

  var conn = mongoDB.getconnection();
  let actions;
  let matchObj = { $match : { actionId : actionId }};
  let lookupObj = { $lookup : { localField:'fields.sourceId', from:'sources', foreignField:'sourceId',as:'sourceIddetails'}};
  let unwindObj = { $unwind : '$sourceIddetails'};
  
  //let unwindObj1 = { $unwind: '$sourceIddetails.resourceDetails'}; 
  // let projectObj = {
  //   $project: {
  //     "name":1,
  //     "description":1,
  //     "typeOfAction":1,
  //     "fields":1,
  //     "createdBy":1,
  //     "actionId":1,
  //     "createdOn":1,
  //     "ServiceDetails":{
        
  //       "$switch":{
  //         "branches": [
  //           { "case": { "$eq": ["$sourceIddetails.resourceDetails.methodOrType","POST"]}, "then":{"_id" : "$sourceIddetails._id", "selectSource":"$sourceIddetails.name","Methodtype":"$sourceIddetails.resourceDetails.methodOrType", "url": "$sourceIddetails.url","serviceName":"$sourceIddetails.resourceDetails.name","Request":"$sourceIddetails.resourceDetails.requestPayload" , "Response":"$sourceIddetails.resourceDetails.responsePayload"}  },
  //           { "case": { "$eq": ["$sourceIddetails.resourceDetails.methodOrType","GET"]}, "then":{ "_id" : "$sourceIddetails._id", "selectSource":"$sourceIddetails.name","Methodtype":"$sourceIddetails.resourceDetails.methodOrType", "url": "$sourceIddetails.url","serviceName":"$sourceIddetails.resourceDetails.name","Response":"$sourceIddetails.resourceDetails.responsePayload" }}
  //         ],
  //         "default":{  }
  //       }
  //     }
  //   }
  // };


  let projectObj = { 
    "$project":{
      "name":1,
      "description":1,
      "typeOfAction":1,
      "fields":1,
      "createdBy":1,
      "actionId":1,
      "createdOn":1,
      "ServiceDetails":{
        "$map":{
          "input":{
            "$filter":{
              "input": "$sourceIddetails.resourceDetails",
              "as": "r",
              "cond": { "$eq":[ "$$r.name", "$fields.serviceName"]} 
            }
          },
          "as": "ress",
          "in":{
            "_id" : "$sourceIddetails._id",
            "selectSource":"$sourceIddetails.name",
            "url": "$sourceIddetails.url",
            "serviceName": "$$ress.name",
            "Methodtype":"$$ress.methodOrType", 
            "Request":"$$ress.requestPayload" , 
            "Response":"$$ress.responsePayload"
          }
        }
      }
    }
  };
  let unwindObj2 = { "$unwind": "$ServiceDetails"};
 
  actions = await conn.collection('actions').aggregate([matchObj, lookupObj, unwindObj, projectObj, unwindObj2]).toArray();
  let action = actions[0];
  rtlogger.log("info", "repo -> getActionById -> actionService : %s", JSON.stringify(actions));
    
  if ( actions.length == 0)
  {
    actions = await conn.collection('actions').findOne({ actionId: actionId });
    rtlogger.log("info", "repo -> getActionById -> action : %s", JSON.stringify(actions));
    return actions;
  } 

  return action;
}

/**
 * @author Rakshith S R
 * @description repo : getActionForRightPanelById
 * @param actionId 
 * @returns actionForRightPanel
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */

exports.getActionForRightPanelById = async (actionId) => {

  rtlogger.log("info", "repo -> getActionForRightPanelById -> actionId : %s", actionId);

  var conn = mongoDB.getconnection();

  let matchObj = { $match: { actionId: actionId } };
  let projectForRightPanel = {
    $project:
    {
      "section_1.name": "$name",
      "section_1.description": "$description",
      "section_2": { "section_2": "$section_2" },
      "section_3.typeOfAction": "$typeOfAction",
      "section_4.createdBy": "$createdBy",
      "section_4.createdOn": "$createdOn",
      "section_4.modifiedBy": "$modifiedBy",
      "section_4.modifiedOn": "$modifiedOn"
    }
  };


  let actions = await conn.collection('actions').aggregate([matchObj, projectForRightPanel]).toArray();
  rtlogger.log("info", "repo -> getActionForRightPanelById -> actions : %s", JSON.stringify(actions));

  let actionForRightPanel = actions[0];
  return actionForRightPanel;
}


/**
 * @author Rakshith S R
 * @description repo : get Filtered Actions
 * @param actionId 
 * @returns action
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getFilteredActions = async (actionType, sourceId, status) => {
  
    var conn = mongoDB.getconnection();
  
    let filterObj = {
      $or : [
          { $and : [ { typeOfAction : "api" }, { "fields.sourceId" : sourceId },{ "status" : status } ] },
          { $and : [{ $or : [ { typeOfAction: { $eq: "sms" } }, { typeOfAction: { $eq: "email" } } ] },{ "status" : status }]}
      ]
    };
   
    let projObj = { name: 1, typeOfAction: 1,actionId:1,_id:0,status:1 };
    
    let action = await conn.collection('actions').find(filterObj).project(projObj).toArray();
    rtlogger.log("info", "repo -> getFilteredActions -> action : %s", JSON.stringify(action));
    return action;
    
   /*

  var conn = mongoDB.getconnection();
  let actionId = "AC_4";


  let matchObj = { $match: { actionId: actionId } };
  let lookupObj = { "$lookup": { "localField": "fields.sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceForAction" } };

  let unwindObj1 = { "$unwind": "$sourceForAction" };
  let unwindObj2 = { "$unwind": "$sourceForAction.resourceDetails" };
  let projectObj = {
    "$project": {
      "name": 1,
      "description": 1,
      "status": 1,
      "statusUpdateComment": "",
      "typeOfAction": 1,
      "nodeType": "Action",
      "resourceDetails": "$sourceForAction.resourceDetails",
      "isResourceExists": { "$cond": [{ "$eq": ['$sourceForAction.resourceDetails.name', '$fields.serviceName'] }, 1, 0] }
    }
  };
  let resourceMatchObj = { "$match": { "isResourceExists": 1 } };
  let actions = await conn.collection('actions').aggregate([matchObj, lookupObj, unwindObj1, unwindObj2, projectObj,resourceMatchObj]).toArray();
  rtlogger.log("info", "repo -> getFilteredActions -> actions : %s", JSON.stringify(actions));

  let actionForRightPanel = actions[0];
  return actionForRightPanel;

  */
}


exports.actiondetailswithtype = async (actionId) => {
 rtlogger.log("info", "repo -> actiondetailswithtype -> actionId : %s", actionId);
 var conn = mongoDB.getconnection();
 //let actionId = "AC_4";


 let matchObj = { $match: { actionId: actionId } };
 let lookupObj = { "$lookup": { "localField": "fields.sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceForAction" } };

 let unwindObj1 = { "$unwind": "$sourceForAction" };
 let unwindObj2 = { "$unwind": "$sourceForAction.resourceDetails" };


 let projectObj = {
   "$project": {
     "name": 1,
     "description": 1,
     "status": 1,
     "statusUpdateComment": "",
     "url":"$sourceForAction.url",
     "typeOfAction": 1,
     "nodeType": "Action",
     "createdBy":1,
     "actionId" : 1,
     "createdOn":1,
     "fields": "$sourceForAction.resourceDetails",
      "isResourceExists": { "$cond": [{ "$eq": ['$sourceForAction.resourceDetails.name', '$fields.serviceName'] }, 1, 0] }
   }
};

let addFieldObj = {$addFields: {"fields.url": "$url" }};


let projectForEmailorSMS = {
  "$project": {
    "name": 1,
    "description": 1,
    "status": 1,
    "statusUpdateComment": "",
    "typeOfAction": 1,
    "nodeType": "Action",
    "createdBy":1,
    "actionId" : 1,
    "createdOn":1,
    "fields": 1
  }
};
 let resourceMatchObj = { "$match": { "isResourceExists": 1 } };
 let actions = await conn.collection('actions').aggregate([matchObj, lookupObj, unwindObj1, unwindObj2, projectObj,addFieldObj,resourceMatchObj]).toArray();
 rtlogger.log("info", "repo -> actiondetailswithtype -> actions : %s", JSON.stringify(actions));


 if (actions.length == 0) {
  rtlogger.log("info", "repo -> actiondetailswithtype -> actions is not service type");
  let matchObj = { $match: { actionId: actionId } };
      actions = await conn.collection('actions').aggregate([matchObj,projectForEmailorSMS]).toArray();
}

 let action = actions[0];
 return action;
}



