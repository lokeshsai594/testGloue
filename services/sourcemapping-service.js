const { getAllSourceMapping, getSourceMappingById, getAllSourceMapWithPagination, createSourceMapping, updateSourceMappingById, deleteSourceMappingById, getNextSequence, getCollectionCount, getSourceMappingsForSourceId, getSourceMappingWithSource,getSourceMapForRightPanelById, getUniqueFieldDetails } = require('../repositories')

const winston = require('winston');
const clogger = winston.loggers.get('clogger');
const axios = require('axios');
const sslConfig = require('./../utils/ssl-config');

const config = require('./../commons/app-config.json');

/**
  * @author RAKSHITH S R
  * @description service : create Source Mapping
  * @param sourceMappingRequest
  * @returns sourceMappingResponse
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.createSourceMapping = async (sourceMappingRequest) => {
  try {

    let sourceMappingResponse;
    let createdSourceMapping;
    let mockApi = config.addSourceMappingURL;

    let sequence = await getNextSequence("counters", "sourceMappingId");
    sourceMappingRequest.sourceMappingId = "SM_" + sequence;
    sourceMappingRequest.createdOn = new Date();

    clogger.log("info", "service -> createSourceMapping -> sourceMappingId : %s", sourceMappingRequest.sourceMappingId);

    createdSourceMapping = await createSourceMapping(sourceMappingRequest);  
    sourceMappingResponse = { data : createdSourceMapping };

    sourceMappingResponse.operation = "insert";
    sourceMappingResponse.keyEntity = "sourceMapping";    
    clogger.log("info", "service -> createSourceMapping -> sourceMappingResponse : %s & mockapi : %s ", JSON.stringify(sourceMappingResponse), mockApi);
    
    let result = await makePutRequest(mockApi, sourceMappingResponse);
    clogger.log("info", "service -> createSourceMapping -> makePutRequest -> result : %s", result);

    return sourceMappingResponse;
  } catch (e) {
    clogger.log("error", "service -> createSourceMapping ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
} 

async function makePutRequest(url, params) {

  try {

    console.log('calling the makePutRequest backend Service..');
    clogger.log("info", "bkdService -> makePutRequest -> url : %s & params : %s ", url, params);

    let res = await axios.put(url, params, { httpsAgent: sslConfig.mutualHTTPAgent });    //callingBackendService
    // console.log(res);
    let response = res.data;
    clogger.log("info", "bkdService -> createSourceMapping -> makePutRequest -> response: %s", JSON.stringify(response));
    console.log(response);
    return response;
  } catch (e) {
    clogger.log("error", "bkdService -> createSourceMapping -> makePutRequest -> error: %s", JSON.stringify(e.message));
    // throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get All SourceMapping
  * @returns sourcemappings
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getAllSourceMapping = async () => {
  try {

    let sourceMappingResponse;
    let sourcemappings;

    sourcemappings = await getAllSourceMapping();
    clogger.log("info", "service -> getAllSourceMapping -> sourcemappings : %s ", sourcemappings);

    sourceMappingResponse = { sourcemappings: sourcemappings };
    return sourcemappings;
  } catch (e) {
    clogger.log("error", "service -> getAllSourceMapping ->  %s", JSON.stringify(e.message));
    throw new Error(e.message);
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get All SourceMappings With Pagination
  * @param pageNumber
  * @param pageSize
  * @returns sourcemappings
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getAllSourceMapWithPagination = async (pageNumber, pageSize) => {
  try {


    let sourceMappingsResponse;
    let totalCount;
    let sourcemappings;
    let totalPages;

    let skipValue = pageSize * (pageNumber - 1);
    let limitValue = pageSize;

    clogger.log("info", "service -> getAllSourceMapWithPagination -> skipValue : %s and limitValue : %s", skipValue, limitValue);
    sourcemappings = await getAllSourceMapWithPagination(skipValue, limitValue);

    //pagination related
    totalCount = await getCollectionCount("sources");
    totalPages = Math.ceil(totalCount / pageSize);
    sourceMappingsResponse = { sourcemappings: sourcemappings, totalPages: totalPages };

    clogger.log("info", "service -> getAllSourceMapWithPagination -> totalCount : %s and totalPages : %s", totalCount, totalPages);
    return sourceMappingsResponse;
  } catch (e) {
    clogger.log("error", "service -> getAllSourceMapWithPagination ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get Source Mapping By Id
  * @param sourceMappingId
  * @returns sourceMappingResponse : sourcemapping
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getSourceMappingById = async (sourceMappingId) => {
  try {

    let sourceMappingResponse;
    let sourcemapping;

    clogger.log("info", "service -> sourceMappingId -> sourceId : %s", sourceMappingId);
    sourcemapping = await getSourceMappingById(sourceMappingId);

    sourceMappingResponse = { sourcemapping: sourcemapping };
    return sourceMappingResponse;
  } catch (e) {
    clogger.log("error", "service -> error ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


/**
  * @author RAKSHITH S R
  * @description service : update Source Mapping By Id
  * @param id
  * @param sourceMappingRequest
  * @returns sourceMappingResponse : sourcemapping
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.updateSourceMappingById = async (id, sourceMappingRequest) => {
  try {

    let sourceMappingResponse;
    let updatedSourcemapping;

    sourceMappingRequest.modifiedOn = new Date().toUTCString();;

    clogger.log("info", "service -> updateSourceMappingById -> sourceMappingRequest : %s", sourceMappingRequest);
    updatedSourcemapping = await updateSourceMappingById(id, sourceMappingRequest);
    clogger.log("info", "service -> updateSourceMappingById -> updatedSourcemapping : %s", updatedSourcemapping);

    sourceMappingResponse = { sourcemapping: updatedSourcemapping };
    return sourceMappingResponse;
  } catch (e) {
    clogger.log("error", "service -> updateSourceMappingById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : delete Source Mapping By Id
  * @param id
  * @returns sourceMappingResponse : sourcemapping
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.deleteSourceMappingById = async (id) => {
  try {
    clogger.log("info", "service -> deleteSourceMappingById -> id : %s", id);
    return await deleteSourceMappingById(id)
  } catch (e) {
    clogger.log("error", "service -> deleteSourceMappingById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get Source Mappings For SourceId
  * @param sourceId
  * @returns sourceMappingResponse : sourceMappingdetails
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getSourceMappingsForSourceId = async (sourceId) => {
  try {
    clogger.log("info", "service -> getSourceMappingsForSourceId -> id : %s", sourceId);
    let sourceMappingdetails = await getSourceMappingsForSourceId(sourceId);
    clogger.log("info", "service -> getSourceMappingsForSourceId -> sourceMappingdetails : %s", sourceMappingdetails);
    let sourceMappingResponse = { sourceMappingdetails: sourceMappingdetails };
    return sourceMappingResponse;
  } catch (e) {
    clogger.log("error", "service -> getSourceMappingsForSourceId ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


/**
  * @author RAKSHITH S R
  * @description service : getSourceMappingWithSource
  * @param sourceId
  * @returns sourceMappingResponse : sourceMappingdetails
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getSourceMappingWithSource = async (sourceId, sourceMappingId) => {

  try {
    clogger.log("info", "service -> getSourceMappingWithSource -> sourceId : %s and sourceMappingId : %s", sourceId, sourceMappingId);
    let sourceMappingWithSource = await getSourceMappingWithSource(sourceId, sourceMappingId);
    clogger.log("info", "service -> getSourceMappingWithSource -> sourceMappingWithSource : %s", sourceMappingWithSource);
    let sourceMappingResponse = { combinedSourceDetails: sourceMappingWithSource };
    return sourceMappingResponse;
  } catch (e) {
    clogger.log("error", "service -> getSourceMappingWithSource ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }

}


/**
  * @author RAKSHITH S R
  * @description service : get Source Mapping By Id
  * @param sourceMappingId
  * @returns sourceMappingResponse : sourcemapping
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
 exports.getSourceMapForRightPanelById = async (sourceMappingId) => {
  try {

    let sourceMappingResponse;
    let sourcemapping;

    clogger.log("info", "service -> getSourceMapForRightPanelById -> sourceMappingId : %s", sourceMappingId);
    sourcemapping = await getSourceMapForRightPanelById(sourceMappingId);

    sourceMappingResponse = { sourcemapping: sourcemapping };
    return sourceMappingResponse;
  } catch (e) {
    clogger.log("error", "service -> getSourceMapForRightPanelById -> error ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}



exports.getUniqueFieldDetails = async (sourceId) => {
  try {

    clogger.log("info", "service -> getUniqueFieldDetails -> sourceId : %s", sourceId);
    let uniqueDetails = await getUniqueFieldDetails(sourceId);

    let sourceMappingResponse = { sourcemapping: uniqueDetails };
    return sourceMappingResponse;
  } catch (e) {
    clogger.log("error", "service -> error ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}





