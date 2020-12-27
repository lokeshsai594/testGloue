var mongoDB = require('../utils/mongo-connector');
const { ObjectId } = require('mongodb');

const winston = require('winston');
const clogger = winston.loggers.get('clogger');


/**
 * @author Rakshith S R
 * @description repo : get All Sources
 * @returns sources
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllSources = async () => {

  var conn = mongoDB.getconnection();

  let sources = await conn.collection('sources').find({}).toArray();
  clogger.log("info", "getAllSources -> sources : %s", JSON.stringify(sources));
  return sources;
}

/**
 * @author Rakshith S R
 * @description repo : get All Sources With Pagination
 * @returns sources
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllSourcesWithPagination = async (skipValue, limitValue) => {

  var conn = mongoDB.getconnection();
  let sources = await conn.collection('sources').find({}).skip(skipValue).limit(limitValue).toArray();
  clogger.log("info", "getAllSourcesWithPagination -> sources : %s", JSON.stringify(sources));
  return sources;
}

/**
 * @author Rakshith S R
 * @description repo : get Source By Id
 * @returns sources
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getSourceById = async (sourceId) => {
  
  let resultResp;

  var conn = mongoDB.getconnection();

  let matchObj = { $match : { sourceId : sourceId }};
  let lookupObj = { $lookup : { localField: 'templateId', from: 'templates', foreignField: 'templateId', as: 'tempdeatils'}};
  let unwindObj = { $unwind : '$tempdeatils'}
  let projObj = {
    $project:{
      "_id": 1,
      "name": 1,
      "protocolDetails": 1,
      "url": 1,
      "sourceMappingReqd": 1,
      "createdBy":1,
      "resourceDetails":1,
      "sourceId": 1,
      "createdOn": 1,
      "isDeleted": 1,
      "templateId": '$tempdeatils.templateId',
      "templateName": '$tempdeatils.name'
    }
  }
  let source = await conn.collection('sources').aggregate([ matchObj, lookupObj, unwindObj ,projObj  ]).toArray();
  
  if(source.length == 0)
  {
    let projObj = {
      $project:{
        "_id": 1,
        "name": 1,
        "protocolDetails": 1,
        "url": 1,
        "sourceMappingReqd": 1,
        "createdBy":1,
        "resourceDetails":1,
        "sourceId": 1,
        "createdOn": 1,
        "isDeleted": 1,
        "templateId": '$templateId'
      }
    }
    let addfields = { $addFields: { "templateName": "" }   }
    let source = await conn.collection('sources').aggregate([ matchObj, projObj, addfields ]).toArray();
    clogger.log("info", "repo -> getSourceById -> sourcewithOutTemplate : %s", JSON.stringify(source));
    resultResp = source[0];
    return resultResp;
  }
  clogger.log("info", "repo -> getSourceById -> sourcewithTemplate : %s", JSON.stringify(source));
  resultResp = source[0];
  return resultResp;
  
}


/**
 * @author Rakshith S R
 * @description repo : get All Filtered Sources wrt sourceMappingReqd flag
 * @returns sources
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllFilteredSources = async (sourceMappingReqd,sourcesToExcludeArr) => {
  clogger.log("info", "repo -> getAllFilteredSources -> sourceMappingReqd : %s", sourceMappingReqd);

  var conn = mongoDB.getconnection();

  let queryToFilter = { sourceMappingReqd: { $eq: sourceMappingReqd }, sourceId: { $nin: sourcesToExcludeArr } };
  //let queryToFilter = { sourceMappingReqd: { $eq: sourceMappingReqd }};
  let fieldsToSelect = { projection: { name: 1, sourceId: 1 } };

  let sources = await conn.collection('sources').find(queryToFilter, fieldsToSelect).toArray();
  clogger.log("info", "repo -> getAllFilteredSources -> sources : %s", JSON.stringify(sources));
  return sources;
}


/**
 * @author Rakshith S R
 * @description repo : getAllMappedSourcesWithOnlyTemp this method get all sources with  below conditions
 * 1. only template chosen for creation of source(no unique ID mapped)
 * 2. Source mapping already done for above source
 * @returns sources
 * @Date 11-07-2020
 * @ModifiedOn 11-07-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllMappedSourcesWithOnlyTemp = async (sourceMappingReqd) => {
  var conn = mongoDB.getconnection();
  let lookupObj = { "$lookup": { "localField": "sourceId", "from": "sourcemappings", "foreignField": "sourceId", "as": "smDetails" } };
  let unwindSourceObj = { "$unwind": "$smDetails" };
  let projectStartObj = { $project: { "name": 1, "sourceId": 1, "sourceMappingReqd": 1, "firstResource": { $arrayElemAt: ["$resourceDetails", 0] } } };
  let matchObj = { "$match": { "$and": [{ "sourceMappingReqd": sourceMappingReqd }, { "firstResource.uniqueKey": { $eq: "" } }] } };
  let projectEndObj = { $project: { "_id":0,"sourceId": 1 } };

  let sourcesWithMapOnlyTemp = await conn.collection('sources').aggregate([lookupObj, unwindSourceObj, projectStartObj, matchObj, projectEndObj]).toArray();
  clogger.log("info", "repo -> getAllMappedSourcesWithOnlyTemp -> sourcesWithMapOnlyTemp : %s", JSON.stringify(sourcesWithMapOnlyTemp));
  return sourcesWithMapOnlyTemp;
}




/**
 * @author Rakshith S R
 * @description repo : get All Filtered Sources wrt sourceMappingReqd flag and protocolType
 * @returns sources
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getFilteredSourcesOne = async (sourceMappingReqd, protocolType) => {
  clogger.log("info", "repo -> getFilteredSources -> sourceMappingReqd : %s and protocolType :%s", sourceMappingReqd, protocolType);
  var conn = mongoDB.getconnection();
  let queryToFilter = { $and: [{ "sourceMappingReqd": { $eq: sourceMappingReqd } }, { "protocolDetails.protocol": { $eq: protocolType } }] };
  //let fieldsToSelect = { projection: { name: 1, sourceId: 1 } };
  let sources = await conn.collection('sources').find(queryToFilter).toArray();
  clogger.log("info", "repo -> getAllFilteredSources -> sources : %s", JSON.stringify(sources));
  return sources;
}

/**
 * @author Rakshith S R
 * @description repo : getSourceWith Payload type
 * @param objectType 
 * @returns sourceResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getFilteredSources = async (isInterpolated, protocolType) => {

  clogger.log("info", "repo -> getFilteredSources -> isInterpolated : %s and protocolType : %s", isInterpolated, protocolType);

  var conn = mongoDB.getconnection();
  let filterObj = { "$match": { "$and": [{ "protocolDetails.protocol": protocolType }, { "resourceDetails": { $elemMatch: { "isInterpolated": isInterpolated } } }] } };

  //let filterObj = { "$match": { "resourceDetails" : { $elemMatch: { "isInterpolated": isInterpolated } } }};
  let projObject = {
    "$project": {
      "name": 1,
      "sourceId": 1,
      "url": 1,
      "resourceDetails": {
        "$map": {
          "input": "$resourceDetails",
          "as": "r",
          "in": {
            "name": "$$r.name",
            "resourceId": "$$r.id",
            "methodOrType": "$$r.methodOrType",
            "responsePayload": "$$r.responsePayload",
            "requestPayload": "$$r.requestPayload",
            "uriOrTopic": "$$r.uriOrTopic",
            "isInterpolated": "$$r.isInterpolated",
            "header": "$$r.header"
          }
        }
      }
    }
  };

  let sources = await conn.collection("sources").aggregate([filterObj, projObject]).toArray();
  clogger.log("info", "repo -> getFilteredSources -> sources : %s", JSON.stringify(sources));
  return sources;

}


/**
 * @author Rakshith S R
 * @description repo : get Source With Template 
 * @param sourceId
 * @returns sourceWithTemplate
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getSourceWithTemplate = async (sourceId) => {
  clogger.log("info", "repo -> getSourceWithTemplate -> sourceId : %s", sourceId);

  var conn = mongoDB.getconnection();

  let matchObj = { $match: { sourceId: sourceId } };
  let lookupObj = { $lookup: { "localField": "templateId", "from": "templates", "foreignField": "templateId", "as": "templateForSource" } }
  let unwindObj = { $unwind: "$templateForSource" };
  let projectObjFirst = { $project: { "sourceId": 1, "templateId": 1, "resource": { "$arrayElemAt": ["$resourceDetails", 0] }, "templateForSource.templateFields": 1, "templateForSource.name": 1 } };
  let projectObjFinal = { $project: { "sourceId": 1, "templateId": 1, "templateForSource.templateFields": 1, "templateForSource.name": 1, "uniqueKey": "$resource.uniqueKey", "schemaProperites": "$resource.responsePayload.schema.properties", "templateForSource.templateFields": 1, "templateName": "$templateForSource.name" } };

  let sources = await conn.collection('sources').aggregate([matchObj, lookupObj, unwindObj, projectObjFirst, projectObjFinal]).toArray();
  clogger.log("info", "repo -> getAllFilteredSources -> sources : %s", JSON.stringify(sources));

  let sourceWithTemplate = sources[0];
  return sourceWithTemplate;
}


/**
 * @author Rakshith S R
 * @description repo : get Source Without Template 
 * @param sourceId
 * @returns sourceWithTemplate
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getSourceWithoutTemplate = async (sourceId) => {

  clogger.log("info", "repo -> getSourceWithoutTemplate -> sourceId : %s", sourceId);

  var conn = mongoDB.getconnection();

  let matchObj = { sourceId: { $eq: sourceId } };
  let sources = await conn.collection('sources').find(matchObj).toArray();
  clogger.log("info", "repo -> getAllFilteredSources -> sources : %s", JSON.stringify(sources));

  let sourceWithTemplate = sources[0];
  return sourceWithTemplate;

}


/**
 * @author Rakshith S R
 * @description repo : get Source Without Template 
 * @param sourceRequest
 * @returns sourceResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.createSource = async (sourceRequest) => {
  var conn = mongoDB.getconnection();
  let sourceResponse = {};
  let sourceResponseObj = await conn.collection('sources').insertOne(sourceRequest);

  sourceResponse = sourceResponseObj.ops[0];
  clogger.log("info", "repo -> createSource -> sourceResponse : %s", JSON.stringify(sourceResponse));
  return sourceResponse;
}

/**
 * @author Rakshith S R
 * @description repo : update Source By Id
 * @param sourceRequest
 * @param id
 * @returns sourceResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.updateSourceById = async (id, sourceRequest) => {
  var conn = mongoDB.getconnection();

  const query = { sourceId: id };
  const updateRequest = { $set: sourceRequest };
  const options = { returnOriginal: false };

  let sourceResponseObj = await conn.collection('sources').findOneAndUpdate(query, updateRequest, options);
  clogger.log("info", "repo -> updateSourceById -> sourceResponse : %s", JSON.stringify(sourceResponseObj.value));

  let sourceResponse = sourceResponseObj.value;
  return sourceResponse;

}


/**
 * @author Rakshith S R
 * @description repo : delete Source By Id
 * @param id
 * @returns sourceResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.deleteSourceById = async (id) => {
  var conn = mongoDB.getconnection();
  clogger.log("info", "repo -> deleteSourceById -> id : %s", id);
  return await conn.collection('sources').deleteOne({ sourceId: id });

}


/**
 * @author Rakshith S R
 * @description repo : getSourceWith Payload type
 * @param objectType 
 * @returns sourceResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getSourceWithObjPayload = async (objectType) => {

  clogger.log("info", "repo -> getSourceWithObjPayload -> objectType : %s", objectType);

  var conn = mongoDB.getconnection();

  let lookupObj = { $lookup: { "localField": "sourceId", "from": "sourcemappings", "foreignField": "sourceId", "as": "smForSource" } }
  let filterObjForSMReq = {
    "$match":
    {
      $and: [
        { "resourceDetails": { $elemMatch: { "responsePayload.schema.type": objectType } } },
        { "smForSource": { $exists: true, $ne: [] } },
        { "sourceMappingReqd": { $eq: true } }
      ]
    }
  };


  let filterObjForSMNotReq = {
    "$match":
    {
      $and: [
        { "resourceDetails": { $elemMatch: { "responsePayload.schema.type": objectType } } },
        { "sourceMappingReqd": { $eq: false } },
        { "protocolDetails.protocol": { $eq: "MQTT" } },
        { "methodOrType": { $eq: "CONSUMER" } }
      ]
    }
  };



  let filterObjForSMReq1 = {
    "$match": {
      $or: [
        {
          $and: [
            { "resourceDetails": { $elemMatch: { "responsePayload.schema.type": objectType, "methodOrType": "CONSUMER" } } },
            { "smForSource": { $exists: true, $ne: [] } },
            { "sourceMappingReqd": { $eq: true } },
            { "protocolDetails.protocol": { $eq: "MQTT" } }

          ]
        },
        {
          $and: [
            { "resourceDetails": { $elemMatch: { "responsePayload.schema.type": objectType } } },
            { "smForSource": { $exists: true, $ne: [] } },
            { "sourceMappingReqd": { $eq: true } },
            { "protocolDetails.protocol": { $eq: "HTTP" } }
          ]
        }
      ]
    }
  }

  let filterObjForSMNotReq1 = {
    "$match": {
      $or: [
        {
          $and: [

            { "sourceMappingReqd": { $eq: false } },
            { "protocolDetails.protocol": "MQTT" },
            { "resourceDetails": { $elemMatch: { "responsePayload.schema.type": objectType, "methodOrType": "CONSUMER" } } }

          ]
        },
        {
          $and: [
            { "resourceDetails": { $elemMatch: { "responsePayload.schema.type": objectType } } },
            { "sourceMappingReqd": { $eq: false } },
            { "protocolDetails.protocol": "HTTP" }
          ]
        }
      ]
    }
  }



  let projObject = {
    "$project": {
      "name": 1,
      "templateSelected": { "$cond": { "if": { "$eq": ["$templateId", ""] }, "then": false, "else": true } },
      "sourceId": 1,
      "sourceMappingReqd": 1,
      "protocol": "$protocolDetails.protocol",
      "url": 1,
      "resourceDetails": {
        "$map": {
          "input": "$resourceDetails",
          "as": "r",
          "in": {
            "uriOrTopic": "$$r.uriOrTopic",
            "methodOrType": "$$r.methodOrType",
            "uniquerIdKey": "$$r.uniqueKey",
            "apiSchemaType": "$$r.responsePayload.schema.type",
            "uniqueIdSelected": { "$cond": { "if": { "$eq": ["$$r.uniqueKey", ""] }, "then": false, "else": true } },
            "responsePayload": "$$r.responsePayload.payload"
          }
        }
      }

    }
  };


  let projFinal = {
    "$project": {
      "name": 1,
      "templateSelected": 1,
      "sourceId": 1,
      "sourceMappingReqd": 1,
      "resourceDetails": 1,
      "uniqueKeySelected": { $arrayElemAt: ["$resourceDetails", 0] }

    }
  };
  let sourcesWithSMRequired = await conn.collection("sources").aggregate([lookupObj, filterObjForSMReq1, projObject]).toArray();
  clogger.log("info", "repo -> getSourceWithObjPayload -> sourcesWithSMRequired : %s", JSON.stringify(sourcesWithSMRequired));


  let sourcesWithSMNotRequired = await conn.collection("sources").aggregate([filterObjForSMNotReq1, projObject]).toArray();
  clogger.log("info", "repo -> getSourceWithObjPayload -> sourcesWithSMNotRequired : %s", JSON.stringify(sourcesWithSMNotRequired));

  let sources = sourcesWithSMNotRequired.concat(sourcesWithSMRequired);
  clogger.log("info", "repo -> getSourceWithObjPayload -> sources : %s", JSON.stringify(sources));
  return sources;

}





/**
 * @author Rakshith S R
 * @description repo : getSourceForRightPanelById Payload type
 * @param sourceId 
 * @returns sourceForRightPanel
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getSourceForRightPanelById = async (sourceId) => {

  clogger.log("info", "repo -> getSourceForRightPanelById -> sourceId : %s", sourceId);

  var conn = mongoDB.getconnection();

  let matchObj = { $match: { sourceId: sourceId } };
  let lookupObj = { $lookup: { "localField": "templateId", "from": "templates", "foreignField": "templateId", "as": "templateForSource" } }
  let unwindObj = { $unwind: "$templateForSource" };
  let projectObjFirst = { $project: { "name": 1, "sourceId": 1, "protocolDetails": 1, "resourcesSize": { "$size": "$resourceDetails" }, "createdBy": 1, "createdOn": 1, "modifiedBy": 1, "modifiedOn": 1, "templateName": "$templateForSource.name" } };

  let projectForRightPanel = {
    $project:
    {
      "section_1.name": "$name",
      "section_2.protocol": "$protocolDetails.protocol",
      "section_2.type": "$protocolDetails.type",
      "section_2.ipOrDomain": "$protocolDetails.ipOrDomain",
      "section_2.port": "$protocolDetails.port",
      "section_3.numberOfResources": "$resourcesSize",
      "section_3.templateName": "$templateName",
      "section_4.createdBy": "$createdBy",
      "section_4.createdOn": "$createdOn",
      "section_4.modifiedBy": "$modifiedBy",
      "section_4.modifiedOn": "$modifiedOn"
    }
  };


  let sources = await conn.collection('sources').aggregate([matchObj, lookupObj, unwindObj, projectObjFirst, projectForRightPanel]).toArray();

  if (sources.length == 0) {
    clogger.log("info", "repo -> getSourceForRightPanelById -> source is without template");
    let matchSourceObj = { $match: { sourceId: sourceId } };
    let projectSourceObjFirst = { $project: { "name": 1, "sourceId": 1, "protocolDetails": 1, "resourcesSize": { "$size": "$resourceDetails" }, "createdBy": 1, "createdOn": 1, "modifiedBy": 1, "modifiedOn": 1, "templateName": "" } };
    sources = await conn.collection('sources').aggregate([matchSourceObj, projectSourceObjFirst, projectForRightPanel]).toArray();
  }
  clogger.log("info", "repo -> getSourceForRightPanelById -> sources : %s", JSON.stringify(sources));

  let sourceForRightPanel = sources[0];
  return sourceForRightPanel;
}



exports.getFilteredPostSources = async (isInterpolated, protocolType, operationType) => {

  let sourceMappingReqd = false;

  clogger.log("info", "repo -> getFilteredPostSources -> isInterpolated : %s, protocolType : %s, operationType: %s", isInterpolated, protocolType, operationType);

  var conn = mongoDB.getconnection();
  let filterObj = { "$match": { "protocolDetails.protocol": protocolType, "sourceMappingReqd": sourceMappingReqd, "resourceDetails": { $elemMatch: { "$and": [{ "isInterpolated": isInterpolated, "methodOrType": operationType }] } } } };
  let resourceMatchObj = { "$match": { "resourceDetails": { "$elemMatch": { "isArray": 1 } } } };

  let projObject = {
    "$project": {
      "name": 1,
      "sourceId": 1,
      "url": 1,
      "sourceMappingReqd": 1,
      "resourceDetails": {
        "$map": {
          "input": {
            "$filter": {
              "input": "$resourceDetails",
              "as": "r",
              "cond": { "$and": [{ "$eq": ["$$r.methodOrType", "POST"] }, { "$isArray": "$$r.responsePayload.payload" }] }
            }
          },
          "as": "ress",
          "in": {
            "name": "$$ress.name",
            "resourceId": "$$ress.id",
            "methodOrType": "$$ress.methodOrType",
            "url": "$url",
            "URLdetails": { "$concat": ["$url", "$$ress.uriOrTopic"] },
            "responsePayload": "$$ress.responsePayload",
            "requestPayload": "$$ress.requestPayload",
            "uriOrTopic": "$$ress.uriOrTopic",
            "isInterpolated": "$$ress.isInterpolated",
            "header": "$$ress.header",
            "isArray": { "$cond": [{ "$isArray": "$$ress.responsePayload.payload" }, 1, 0] }
            //"sizz": { "$cond": { if: { "$isArray": "$ress" }, then: { "$size": "$ress" }, else: "0"} }

          }
        }
      }
    }
  };

  let sources = await conn.collection("sources").aggregate([filterObj, projObject, resourceMatchObj]).toArray();
  clogger.log("info", "repo -> getFilteredPostSources -> sources : %s", JSON.stringify(sources));
  return sources;
}



exports.getFilteredGetSources = async (isInterpolated, protocolType, operationType) => {

  let sourceMappingReqd = false;

  clogger.log("info", "repo -> getFilteredGetSources -> isInterpolated : %s, protocolType : %s, operationType: %s", isInterpolated, protocolType, operationType);

  var conn = mongoDB.getconnection();
  let filterObj = { "$match": { "protocolDetails.protocol": protocolType, "sourceMappingReqd": sourceMappingReqd, "resourceDetails": { $elemMatch: { "$and": [{ "isInterpolated": isInterpolated, "methodOrType": operationType }] } } } };
 
  let projObject = {
    "$project": {
      "name": 1,
      "sourceId": 1,
      "url": 1,
      "sourceMappingReqd": 1,
      "resourceDetails": {
        "$map": {
          "input": {
            "$filter": {
              "input": "$resourceDetails",
              "as": "r",
              "cond": { "$and": [{ "$eq": ["$$r.methodOrType", "GET"] } ] }
            }
          },
          "as": "ress",
          "in": {
            "name": "$$ress.name",
            "resourceId": "$$ress.id",
            "methodOrType": "$$ress.methodOrType",
            "url": "$url",
            "URLdetails": { "$concat": ["$url", "$$ress.uriOrTopic"] },
            "responsePayload": "$$ress.responsePayload",
            // "requestPayload": "$$ress.requestPayload",
            "uriOrTopic": "$$ress.uriOrTopic",
            "isInterpolated": "$$ress.isInterpolated",
            "header": "$$ress.header"
          }
        }
      }
    }
  };

  let sources = await conn.collection("sources").aggregate([filterObj, projObject ]).toArray();
  clogger.log("info", "repo -> getFilteredGetSources -> sources : %s", JSON.stringify(sources));
  return sources;
}



exports.getFilteredAllresources = async (isInterpolated, protocolType, operationType) => {

  let sourceMappingReqd = false;

  clogger.log("info", "repo -> getFilteredAllresources -> isInterpolated : %s, protocolType : %s, operationType: %s", isInterpolated, protocolType, operationType);

  var conn = mongoDB.getconnection();
  let filterObj = { "$match": { "protocolDetails.protocol": protocolType, "sourceMappingReqd": sourceMappingReqd, "resourceDetails": { $elemMatch: { "$and": [{ "isInterpolated": isInterpolated }] } } } };
 
  let projObject = {
    "$project": {
      "name": 1,
      "sourceId": 1,
      "url": 1,
      "sourceMappingReqd": 1,
      "resourceDetails": {
        "$map": {
          "input": {
            "$filter": {
              "input": "$resourceDetails",
              "as": "r",
              "cond": { "$or": [{ "$eq": ["$$r.methodOrType", "GET"] }, { "$eq": ["$$r.methodOrType", "POST"] } ] }
            }
          },
          "as": "ress",
          "in": {
            "name": "$$ress.name",
            "resourceId": "$$ress.id",
            "methodOrType": "$$ress.methodOrType",
            "url": "$url",
            "URLdetails": { "$concat": ["$url", "$$ress.uriOrTopic"] },
            "responsePayload": "$$ress.responsePayload",
            "requestPayload": "$$ress.requestPayload",
            "uriOrTopic": "$$ress.uriOrTopic",
            "isInterpolated": "$$ress.isInterpolated",
            "header": "$$ress.header"
          }
        }
      }
    }
  };

  let sources = await conn.collection("sources").aggregate([filterObj, projObject ]).toArray();
  clogger.log("info", "repo -> getFilteredGetSources -> sources : %s", JSON.stringify(sources));
  return sources;
}