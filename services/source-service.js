const { getAllSources, getAllSourcesWithPagination, getSourceById, getAllFilteredSources, getSourceWithTemplate, getSourceWithoutTemplate, createSource, updateSourceById, deleteSourceById, getNextSequence, getCollectionCount, getFilteredSources, getFilteredPostSources, getFilteredGetSources, getFilteredAllresources, getSourceWithObjPayload ,getSourceForRightPanelById,getAllMappedSourcesWithOnlyTemp} = require('../repositories')

const winston = require('winston');
const axios = require('axios');
const clogger = winston.loggers.get('clogger');
const config = require('./../commons/app-config.json');
const https = require('https');

const sslConfig = require('./../utils/ssl-config');
var RightPanel = require("../models/RightPanel.js");



/**
  * @author RAKSHITH S R
  * @description service : create Source
  * @param sourceRequest
  * @returns sourceResponse : createdSource
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.createSource = async (sourceRequest) => {
  try {

    
    let sourceResponse;
    let createdSource;

    let schemaGeneratorUrl = config.schemaGeneratorUrl;

    clogger.log("info", "service -> createSource -> sourceRequest : %s and schemaGeneratorUrl : %s", JSON.stringify(sourceRequest),schemaGeneratorUrl);
    let promisesArr = [];

    for (i = 0; i < sourceRequest.resourceDetails.length; i++) {

      let resourceDetailsObj = sourceRequest.resourceDetails[i];
      let payload = resourceDetailsObj.responsePayload.payload;
      let postBody = { "payload": payload };
      clogger.log("info", "service -> createSource -> postBody : %s", JSON.stringify(postBody));

      let response = await post(schemaGeneratorUrl, postBody);
      sourceRequest.resourceDetails[i].responsePayload.schema = response.schema;
      //promisesArr.push(response);
    }

    //let res = await axios.all(promisesArr);
    clogger.log("info", "service -> createSource -> sourceRequest after schema generation: %s", JSON.stringify(sourceRequest));

    let sequence = await getNextSequence("counters", "sourceId");
    sourceRequest.sourceId = "SG_" + sequence;
    sourceRequest.createdOn = new Date().toUTCString();
    sourceRequest.isDeleted = false;
    clogger.log("info", "service -> createSource -> sourceId : %s", sourceRequest.sourceId);
    createdSource = await createSource(sourceRequest);

    sourceResponse = { source: createdSource };
    return sourceResponse;
  } catch (e) {
    clogger.log("error", "service -> createSource ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get All Sources
  * @returns sourceResponse : sources
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getAllSources = async () => {
  try {

    let sources;
    let sourceResponse;

    sources = await getAllSources();
    clogger.log("info", "service -> getAllSources -> sources : %s ", sources);

    sourceResponse = { sources: objsources };
    return sourceResponse;
  } catch (e) {
    clogger.log("error", "service -> getAllSources ->  %s", JSON.stringify(e.message));
    throw new Error(e.message);
  }
}


/**
  * @author RAKSHITH S R
  * @description service : get All Sources With Pagination
  * @param pageNumber
  * @param pageSize
  * @returns sourceResponse : sources
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getAllSourcesWithPagination = async (pageNumber, pageSize) => {
  try {

    let sourceResponse;
    let totalCount;
    let sources;
    let totalPages;

    let skipValue = pageSize * (pageNumber - 1);
    let limitValue = pageSize;

    clogger.log("info", "service -> getAllSourcesWithPagination -> skipValue : %s and limitValue : %s", skipValue, limitValue);
    sources = await getAllSourcesWithPagination(skipValue, limitValue);

    //pagination related
    totalCount = await getCollectionCount("sources");
    totalPages = Math.ceil(totalCount / pageSize);
    sourceResponse = { sources: sources, totalPages: totalPages };

    clogger.log("info", "service -> getAllSourcesWithPagination -> totalCount : %s and totalPages : %s", totalCount, totalPages);
    return sourceResponse;
  } catch (e) {
    clogger.log("error", "service -> getAllSourcesWithPagination ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


/**
  * @author RAKSHITH S R
  * @description service : get Source By Id
  * @param sourceId
  * @returns sourceResponse : source
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getSourceById = async (sourceId) => {
  try {

    let sourceResponse;
    let source;
    clogger.log("info", "service -> getSourceById -> sourceId : %s", sourceId);
    source = await getSourceById(sourceId);
    clogger.log("info", "service -> getSourceById -> source : %s ", source);
    sourceResponse = { source: source };
    return sourceResponse;
  } catch (e) {
    clogger.log("error", "service -> getSourceById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get All Sources With sourceMappingReqd
  * @param sourceMappingReqd
  * @returns sourceResponse : sources
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getAllSourcesWithMappReqd = async (sourceMappingReqd) => {
  try {


    let sourcesWithMapOnlyTemp = await getAllMappedSourcesWithOnlyTemp(sourceMappingReqd);


    let sourcesToExcludeArr = sourcesWithMapOnlyTemp.map(function (source) {return source.sourceId;});
    clogger.log("info", "service -> getAllSourcesWithMappReqd -> sourcesToExcludeArr : %s", sourcesToExcludeArr);

    clogger.log("info", "service -> getAllSourcesWithMappReqd -> sourceMappingReqd : %s", sourceMappingReqd);
    let sources = await getAllFilteredSources(sourceMappingReqd,sourcesToExcludeArr);
    clogger.log("info", "service -> getAllSourcesWithMappReqd -> sources : %s ", sources);
    let sourceResponse = { sourcesForMapping: sources };
    return sourceResponse;
  } catch (e) {
    clogger.log("error", "service -> getAllSourcesWithMappReqd ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get Filtered Sources with sourceMappingReqd and protocolType
  * @param sourceMappingReqd
  * @param protocolType
  * @returns sourceResponse : sources
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getFilteredSources = async (interpolated, protocolType) => {
  try {
    clogger.log("info", "service -> getFilteredSources -> interpolated : %s and protocolType :%s", interpolated, protocolType);
    let sources = await getFilteredSources(interpolated, protocolType);
    clogger.log("info", "service -> getFilteredSources -> sources : %s ", sources);
    let sourceResponse = { sources: sources };
    return sourceResponse;
  } catch (e) {
    clogger.log("error", "service -> getFilteredSources ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : getSource With Template
  * @param sourceId
  * @returns sourceWithTempResponse : source
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getSourceWithTemplate = async (sourceId) => {

  let source;

  clogger.log("info", "service -> getSourceWithTemplate -> sourceId: %s", sourceId);
  let sourceWithTemplate = await getSourceWithTemplate(sourceId);
  clogger.log("info", "service -> getSourceWithTemplate -> sourceWithTemplate: %s", sourceWithTemplate);


  if (typeof sourceWithTemplate !== 'undefined') {

    let uniqueKey = sourceWithTemplate.uniqueKey;
    clogger.log("info", "service -> getSourceWithTemplate -> uniqueKey: %s", uniqueKey);

    let uniqueKeyType = "";
    if (uniqueKey || uniqueKey.length != 0) {
      clogger.log("info", "service -> getSourceWithTemplate -> uniqueKey exists uniqueKey: %s ", uniqueKey);
      uniqueKeyType = sourceWithTemplate.schemaProperites[uniqueKey].type;
    }

    clogger.log("info", "service -> getSourceWithTemplate -> uniqueKey : %s and uniqueKeyType : %s", uniqueKey, uniqueKeyType);

    //sourceWithTemplate.uniqueKeyType = uniqueKeyType;
    delete sourceWithTemplate['schemaProperites'];
    delete sourceWithTemplate['uniqueKey'];


    let uniqueId = { "key": uniqueKey, "type": uniqueKeyType };
    sourceWithTemplate.uniqueId = uniqueId;

    clogger.log("info", "service -> getSourceWithTemplate -> source : %s ", sourceWithTemplate);
    source = sourceWithTemplate;

  } else {
    clogger.log("info", "service -> getSourceWithTemplate -> template not present ");

    source = await getSourceById(sourceId);
    clogger.log("info", "service -> getSourceWithTemplate -> 22222->%s  ", JSON.stringify(source));

    let resourceDetail = source.resourceDetails[0];
    let uniqueKey = resourceDetail.uniqueKey;

    let uriOrTopic = resourceDetail.uriOrTopic;
    clogger.log("info", "service 55 -> getSourceWithTemplate -> uniqueKey.length -> %s", uniqueKey.length);
    if (uniqueKey || uniqueKey.length != 0) {

      clogger.log("info", "service 444-> getSourceWithTemplate -> uniqueKey->%s and resourceDetail->%s  and uriOrTopic -> %s", uniqueKey, JSON.stringify(resourceDetail), uriOrTopic);

      let uniqueKeyType = resourceDetail.responsePayload.schema.properties[uniqueKey].type;
      let uniqueId = { "key": uniqueKey, "type": uniqueKeyType };

      source.uniqueId = uniqueId;


      clogger.log("info", "service -> getSourceWithTemplate -> formatted source->%s  ", JSON.stringify(source));
    } else {

      let uniqueId = { "key": "", "type": "" };
      source.uniqueId = uniqueId;


      clogger.log("info", "service -> getSourceWithTemplate -> source is without uniqueKey");
    }

    source.templateForSource = {};
    source.templateName = "";
    delete source['protocolDetails'];
    delete source['resourceDetails'];
    delete source['name'];
    delete source['url'];
    delete source['sourceMappingReqd'];
    delete source['createdBy'];
    delete source['createdOn'];
    clogger.log("info", "service -> getSourceWithTemplate -> template not present -> source : %s ", source);

  }

  let sourceWithTempResponse = { sourcesWithTemplate: source };
  return sourceWithTempResponse;

}

/**
  * @author RAKSHITH S R
  * @description service : get Source With Template
  * @param id
  * @param sourceRequest
  * @returns sourceResponse : updatedSource
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.updateSourceById = async (id, sourceRequest) => {
  try {
    let sourceResponse;
    let updatedSource;

    sourceRequest.modifiedOn = new Date();

    clogger.log("info", "service -> updateSourceById -> sourceRequest : %s", sourceRequest);
    updatedSource = await updateSourceById(id, sourceRequest);
    clogger.log("info", "service -> updateSourceById -> updatedSource : %s ", updatedSource);
    sourceResponse = { source: updatedSource };
    return sourceResponse;

  } catch (e) {
    clogger.log("error", "service -> updateSourceById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : delete Source By Id
  * @param id
  * @returns sourceResponse : null
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.deleteSourceById = async (id) => {
  try {
    clogger.log("info", "service -> deleteSourceById -> id : %s", id);
    return await deleteSourceById(id);
  } catch (e) {
    clogger.log("error", "service -> deleteSourceById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


/**
  * @author RAKSHITH S R
  * @description service : get Sources With Obj Payload
  * @param isObjectPayload
  * @returns sourceResponse : sources
  * @Date 06-05-2020
  * @ModifiedOn 06-05-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getSourcesWithObjPayload = async (payloadType) => {
  try {
    clogger.log("info", "service -> getSourcesWithObjPayload -> payloadType : %s", payloadType);
    let sources = await getSourceWithObjPayload(payloadType);
    clogger.log("info", "service -> getSourcesWithObjPayload -> sources : %s ", sources);
    let sourceResponse = { sourcedetails: sources };
    return sourceResponse;
  } catch (e) {
    clogger.log("error", "service -> getSourcesWithObjPayload ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


/**
  * @author RAKSHITH S R
  * @description service :  private method to make post call
  * @param url
  * @param params
  * @returns response : schema generator response
  * @Date 08-05-2020
  * @ModifiedOn 08-05-2020
  * @ModifiedBy RAKSHITH S R
  */

async function post(url, params) {

  try {
      
    let res = await axios.post(url, params,{ httpsAgent: sslConfig.mutualHTTPAgent });
    let response = res.data;
    clogger.log("info", "service -> schema generation -> post ->  %s", JSON.stringify(res.data));
    return response;
  } catch (error) {
    clogger.log("error", "service -> source -> schema generation  error status : %s and error message : %s", error.response.status, error.response.data.message);
    throw new Error("Error in schema generation : " + error.response.data.message);
  }
}


/**
  * @author RAKSHITH S R
  * @description service : UI Specific : getSourceForRightPanelById
  * @param sourceId
  * @returns sourceResponse : source
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
 exports.getSourceForRightPanelById = async (sourceId) => {
  try {

    let sourceResponse;
    let source;
    clogger.log("info", "service -> getSourceForRightPanelById -> sourceId : %s", sourceId);
    source = await getSourceForRightPanelById(sourceId);
    clogger.log("info", "service -> getSourceForRightPanelById -> source : %s ", source);
    sourceResponse = { source: source };
    return sourceResponse;
  } catch (e) {
    clogger.log("error", "service -> getSourceForRightPanelById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}



exports.getFilteredWidgetSources = async (interpolated, protocolType, operationType) => {

  try {

    let sourceResult;
    clogger.log("info", "service -> getFilteredWidgetSources -> interpolated : %s, protocolType :%s,operationType -> %s", interpolated, protocolType, operationType);
    
    if (operationType == "POST") {

      sourceResult = await getFilteredPostSources(interpolated, protocolType, operationType);
      clogger.log("info", "service -> getFilteredPostSources -> interpolated : %s, protocolType :%s,operationType -> %s", interpolated, protocolType, operationType);
    } else if (operationType == "GET") {

      sourceResult = await getFilteredGetSources(interpolated, protocolType, operationType);
      clogger.log("info", "service -> getFilteredGetSources -> interpolated : %s, protocolType :%s,operationType -> %s", interpolated, protocolType, operationType);
    } else if (operationType == "ALL") {

      sourceResult = await getFilteredAllresources(interpolated, protocolType, operationType);
      clogger.log("info", "service -> getFilteredAllresources -> interpolated : %s, protocolType :%s,operationType -> %s", interpolated, protocolType, operationType);
    }else {

      clogger.log("error", "service -> getFilteredWidgetSources -> %s", "Invalid operationType");
      throw new Error("Invalid operationType");
    }
    
    clogger.log("info", "service -> getFilteredWidgetSources -> sources : %s ", sourceResult);
    let sourceResponse = { sources: sourceResult };
    return sourceResponse;
  } catch (e) {
    clogger.log("error", "service -> getFilteredWidgetSources ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}