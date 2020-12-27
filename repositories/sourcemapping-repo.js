var mongoDB = require('../utils/mongo-connector');
const { ObjectId } = require('mongodb');

const winston = require('winston');
const clogger = winston.loggers.get('clogger');


/**
 * @author Rakshith S R
 * @description repo : get All Source Mappings
 * @returns sourcemappings
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllSourceMappings = async () => {

  var conn = mongoDB.getconnection();

  let sourcemappings = await conn.collection('sourcemappings').find({}).toArray();
  clogger.log("info", "repo -> getAllSourceMappings -> sourcemappings : %s", JSON.stringify(sourcemappings));
  return sourcemappings;
}

/**
 * @author Rakshith S R
 * @description repo : get All Source Map With Pagination
 * @param skipValue
 * @param limitValue
 * @returns sourcemappings
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllSourceMapWithPagination = async (skipValue, limitValue) => {

  var conn = mongoDB.getconnection();
  let sourcemappings = await conn.collection('sourcemappings').find({}).skip(skipValue).limit(limitValue).toArray();
  clogger.log("info", "repo -> getAllSourceMapWithPagination -> sourcemappings : %s", JSON.stringify(sourcemappings));
  return sourcemappings;
}

/**
 * @author Rakshith S R
 * @description repo : get SourceMapping By Id
 * @param sourceMappingId
 * @returns sourcemapping
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getSourceMappingById = async (sourceMappingId) => {

  var conn = mongoDB.getconnection();

  let matchObj = { $match : { sourceMappingId: sourceMappingId}};
  let lookupObj = { $lookup : { localField:'sourceId',from:'sources',foreignField:'sourceId',as: 'sourceIddetails'}};
  let unwindObj = { $unwind: '$sourceIddetails'};
  let projectObj = { 
    $project: {
      "name":1,
      "uniqueKey":1,
      "mappingDetails":1,
      "createdBy":1,
      "sourceMappingId":1,
      "createdOn":1,
      "source": { "_id" : "$sourceIddetails._id", "name":"$sourceIddetails.name","sourceId": "$sourceId"}
    }
  };

  let sourcemapping = await conn.collection('sourcemappings').aggregate([matchObj, lookupObj, unwindObj, projectObj]).toArray();
  
  //let sourcemapping = await conn.collection('sourcemappings').findOne({ sourceMappingId: sourceMappingId });
  clogger.log("info", "repo -> getSourceMappingById -> sourcemapping : %s", JSON.stringify(sourcemapping));
  let result = sourcemapping[0];
  return result;
}


/**
 * @author Rakshith S R
 * @description repo : get Source Mappings For SourceId
 * @param sourceId
 * @returns sourcemappings
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getSourceMappingsForSourceId = async (sourceId) => {
  var conn = mongoDB.getconnection();

  let matchObj = { "$match": { "sourceId": sourceId } };
  let lookupObj = { "$lookup": { "localField": "sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceWithMappings" } };
  let unwindSource = { "$unwind": "$sourceWithMappings" };
  let fieldsToSelect = { "$project": { "name": 1, "sourceMappingId": 1,"templateId":"$sourceWithMappings.templateId", "templateSelected": { "$cond": { "if": { "$eq": ["$sourceWithMappings.templateId", ""] }, "then": false, "else": true } } } };

  // let fieldsToSelect = { "$project": {"name": 1,"sourceMappingId": 1,"templateSelected":"$sourceWithMappings.templateId" } }

  let sourcemappings = await conn.collection('sourcemappings').aggregate([matchObj, lookupObj, unwindSource, fieldsToSelect]).toArray();
  clogger.log("info", "repo -> getSourceMappingsForSourceId -> sourcemappings : %s", JSON.stringify(sourcemappings));
  return sourcemappings;

}



/**
 * @author Rakshith S R
 * @description repo : getSource Mapping With Source
 * @param sourceId
 * @param sourceMappingId
 * @returns sourcemappingWithSource
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getSourceMappingWithSource = async (sourceId, sourceMappingId) => {

  /*USE BELOW QUERY CRITERIA FOR S inside SM */
  //let andMatch = { "$match": { "$and": [{ "sourceMappingId": sourceMappingId }, { "sourceId": sourceId }] } };
  //let lookupObj = { "$lookup": { "localField": "sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceDetails" } };
  //let unwindSource = { "$unwind": "$sourceDetails" };


  /*USE BELOW QUERY CRITERIA FOR SM inside S */
  let lookupObj = { "$lookup": { "localField": "sourceId", "from": "sourcemappings", "foreignField": "sourceId", "as": "sourceMappingDetails" } };
  let unwindSource = { "$unwind": "$sourceMappingDetails" };
  let andMatch = { "$match": { "$and": [{ "sourceMappingDetails.sourceMappingId": sourceMappingId }, { "sourceId": sourceId }] } };

  var conn = mongoDB.getconnection();
  let sourcemappingWithSourceArr = await conn.collection('sources').aggregate([lookupObj, unwindSource, andMatch]).toArray();
  clogger.log("info", "repo -> getSourceMappingWithSource -> sourcemappingWithSource : %s", JSON.stringify(sourcemappingWithSourceArr[0]));

  let sourcemappingWithSource = sourcemappingWithSourceArr[0];
  return sourcemappingWithSource;
}



/**
 * @author Rakshith S R
 * @description repo : create SourceMapping
 * @param sourceMappingRequest
 * @returns sourceMappingResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.createSourceMapping = async (sourceMappingRequest) => {
  var conn = mongoDB.getconnection();
  let sourceMappingResponse = {};
  let sourceMappingResponseObj = await conn.collection('sourcemappings').insertOne(sourceMappingRequest);

  sourceMappingResponse = sourceMappingResponseObj.ops[0];
  clogger.log("info", "repo -> createSourceMapping -> sourceMappingResponse : %s", JSON.stringify(sourceMappingResponse));
  return sourceMappingResponse;

}

/**
 * @author Rakshith S R
 * @description repo : update Source Mapping By Id
 * @param id
 * @param sourceMappingRequest
 * @returns sourceMappingResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.updateSourceMappingById = async (id, sourceMappingRequest) => {
  var conn = mongoDB.getconnection();
  const query = { sourceMappingId: id };
  const updateRequest = { $set: sourceMappingRequest };
  const options = { returnOriginal: false };

  let sourceMappingResponseObj = await conn.collection('sourcemappings').findOneAndUpdate(query, updateRequest, options);
  clogger.log("info", "repo -> updateSourceMappingById -> sourceMappingResponse : %s", JSON.stringify(sourceMappingResponseObj.value));

  let sourceMappingResponse = sourceMappingResponseObj.value;
  return sourceMappingResponse;

}

/**
 * @author Rakshith S R
 * @description repo : delete SourceMapping By Id
 * @param id
 * @returns null
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.deleteSourceMappingById = async (id) => {
  var conn = mongoDB.getconnection();
  clogger.log("info", "repo -> deleteSourceMappingById -> id : %s", id);
  return conn.collection('sourcemappings').deleteOne({ sourceMappingId: id });

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
exports.getSourceMapForRightPanelById = async (sourceMappingId) => {

  clogger.log("info", "repo -> getSourceMapForRightPanelById -> sourceMappingId : %s", sourceMappingId);

  var conn = mongoDB.getconnection();

  let matchObj = { $match: { sourceMappingId: sourceMappingId } };
  let lookupObj = { $lookup: { "localField": "sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceDetails" } }
  let unwindObj = { $unwind: "$sourceDetails" };
  let projectObjFirst = { $project: { "name": 1, "sourceId": 1, "mappingsSize": { "$size": "$mappingDetails" }, "createdBy": 1, "createdOn": 1, "modifiedBy": 1, "modifiedOn": 1, "sourceName": "$sourceDetails.name" } };

  let projectForRightPanel = {
    $project:
    {
      "section_1.name": "$name",
      "section_2": { "section_2": "$section_2"},
      "section_3.sourceName": "$sourceName",
      "section_3.mappingSize": "$mappingsSize",
      "section_4.createdBy": "$createdBy",
      "section_4.createdOn": "$createdOn",
      "section_4.modifiedBy": "$modifiedBy",
      "section_4.modifiedOn": "$modifiedOn"
    }
  };


  let sourcemappings = await conn.collection('sourcemappings').aggregate([matchObj, lookupObj, unwindObj, projectObjFirst, projectForRightPanel]).toArray();
  clogger.log("info", "repo -> getSourceMapForRightPanelById -> sourcemappings : %s", JSON.stringify(sourcemappings));

  let sourcemapForRightPanel = sourcemappings[0];
  return sourcemapForRightPanel;
}





exports.getUniqueFieldDetails = async (sourceId) => {

  clogger.log("info", "repo -> getUniqueFieldDetails -> sourceId : %s", sourceId);  

   var conn = mongoDB.getconnection();

  let matchObj = { $match : { 'sourceId': sourceId }};
  let unwindObj = { $unwind : "$mappingDetails" };
  let projectObj = { 
    $project: { 
      "_id": 0,
      "name": 1,
      "sourceId": 1,
      "uniqueKey": 1,
      "sourceMappingId": 1,
      "dimensions": { $objectToArray: "$mappingDetails" }
    }
  };
  let projectObj1 = { 
    $project: {
      "_id" : 0,
      "name": 1,
      "sourceId": 1,
      "uniqueKey": 1,
      "sourceMappingId": 1,
      "endpint": {
        "$map": {
          "input": {
            "$filter": {
              "input": "$dimensions",
              "as": "r",
              "cond": { "$eq": ["$uniqueKey", "$$r.k"] }
            }
          },
          "as": "ress",
          "in": { "va": "$$ress.v" }
        }
      }
    }
  };
  let unwindObj1 = { $unwind: "$endpint" };
  
  let groupObj = { 
    $group: { 
      _id: { "name": "$name", "sourceMappingId": "$sourceMappingId"},
       "endpoints":  { "$addToSet": "$endpint.va" }   
      }
  };   

  let groupObj1 = { 
    $group: {
      _id: { "name": "$name", "sourceMappingId": "$sourceMappingId"},
       "endpoints":  { "$addToSet": "$endpint.va" } 
    }
  };

  let uniqueDetails = await conn.collection('sourcemappings').aggregate([matchObj, unwindObj, projectObj, projectObj1, unwindObj1, groupObj ]).toArray();  

  if (uniqueDetails.length == 0) {
    console.log("uniqueKey value is not present");
    let uniqueDetails = await conn.collection('sourcemappings').aggregate([matchObj, unwindObj, groupObj1]).toArray();
    clogger.log("info", "repo -> getUniqueFieldDetails -> noUniqueDetails : %s", JSON.stringify(uniqueDetails));
    return uniqueDetails;
  } else {
    clogger.log("info", "repo -> getUniqueFieldDetails -> uniqueDetails : %s", JSON.stringify(uniqueDetails));
    return uniqueDetails;
  }
}