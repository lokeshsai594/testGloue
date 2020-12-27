const { sourceService } = require('../../src/services');

const winston = require('winston');
const clogger = winston.loggers.get('clogger');

const createSource = sourceService.createSource;
const getAllSources = sourceService.getAllSources;
const updateSourceById = sourceService.updateSourceById;
const deleteSourceById = sourceService.deleteSourceById;
const getAllSourcesWithPagination = sourceService.getAllSourcesWithPagination;
const getSourceById = sourceService.getSourceById;
const getAllSourcesWithMappReqd = sourceService.getAllSourcesWithMappReqd;
const getSourceWithTemplate = sourceService.getSourceWithTemplate;
const getFilteredSources = sourceService.getFilteredSources;
const getSourcesWithObjPayload = sourceService.getSourcesWithObjPayload;
const getSourceForRightPanelById = sourceService.getSourceForRightPanelById;
const getFilteredWidgetSources = sourceService.getFilteredWidgetSources;

var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");

let constants = require('../utils/constants');

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  create Source
 * @returns successResponse : sourceResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.createSource = async (req, res, next) => {

  const sourceRequest = req.body;

  try {
    let sourceResponse = await createSource(sourceRequest);
    clogger.log("info", "controller -> createSource -> %s", JSON.stringify(sourceResponse));

    //let result = {"source" : sourceResponse};
    var successResponse = new SuccessResponse(constants.SUCCESS, sourceResponse);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> createSource -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  get All Sources
 * @returns successResponse :  sources and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getAllSources = async (req, res, next) => {
  try {

    let sources = await getAllSources();
    clogger.log("info", "controller -> getAllSources -> %s", JSON.stringify(sources));
    //let result = {"sources" : sources};
    var successResponse = new SuccessResponse(constants.SUCCESS, sources);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getAllSources -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  get All Sources With Pagination
 * @returns successResponse :  sources and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getAllSourcesWithPagination = async (req, res, next) => {
  try {

    let queryParams = req.query;

    let pageNumber = parseInt(queryParams.page_no);
    let pageSize = parseInt(queryParams.page_size);

    clogger.log("info", "controller -> getAllSourcesWithPagination -> pageNo : %s and pageSize : %s", pageNumber, pageSize);

    let sources = await getAllSourcesWithPagination(pageNumber, pageSize);
    clogger.log("info", "controller -> getAllSourcesWithPagination -> %s", JSON.stringify(sources));

    //let result = {"sources" : sources};
    var successResponse = new SuccessResponse(constants.SUCCESS, sources);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getAllSourcesWithPagination -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  get Source By Id
 * @returns successResponse :  source and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getSourceById = async (req, res, next) => {

  try {

    let sourceId = req.params.sourceId;
    clogger.log("info", "controller -> getSourceById -> sourceId : %s", sourceId);
    let source = await getSourceById(sourceId);

    let successResponse = new SuccessResponse(constants.SUCCESS, source);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getSourceById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}




/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  update Source By Id
 * @returns successResponse :  source and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.updateSourceById = async (req, res, next) => {

  try {

    const sourceRequest = req.body;
    let sourceId = req.params.sourceId;

    clogger.log("info", "controller -> updateSourceById -> %s", JSON.stringify(sourceRequest));

    let source = await updateSourceById(sourceId, sourceRequest);

    //let result = {"source" : source};
    var successResponse = new SuccessResponse(constants.SUCCESS, source);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  delete Source By Id
 * @returns successResponse : null and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.deleteSourceById = async (req, res, next) => {

  try {

    let sourceId = req.params.sourceId;
    await deleteSourceById(sourceId);
    var successResponse = new SuccessResponse(constants.SUCCESS, null);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> deleteSourceById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);

  }
}


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  common API's : get Filtered Sources
 * @returns successResponse : sourceResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getFilteredSources = async (req, res, next) => {

  try {
    clogger.log("info", "controller -> getFilteredSources ->  query params ->%s", req.query);
    let sourceResponse;
    let queryParams = req.query;
    
    let queryParamLength = Object.keys(req.query).length;

    if (queryParamLength !== 0 && typeof queryParams.interpolated !== 'undefined' && typeof queryParams.protocolType !== 'undefined' && typeof queryParams.operationType !== 'undefined') {
      let interpolated = (queryParams.interpolated == "true");
      let protocolType = queryParams.protocolType;
      let operationType = queryParams.operationType;
      clogger.log("info", "controller -> getFilteredWidgetSources -> interpolated -> %s,protocolType -> %s,operationType -> %s", interpolated, protocolType,operationType);
      sourceResponse = await getFilteredWidgetSources(interpolated, protocolType,operationType);
    } else if (queryParamLength !== 0 && typeof queryParams.interpolated !== 'undefined' && typeof queryParams.protocolType !== 'undefined') {
      let interpolated = (queryParams.interpolated == "true");
      let protocolType = queryParams.protocolType;
      clogger.log("info", "controller -> getFilteredSources -> interpolated -> %s,protocolType -> %s", interpolated, protocolType);
      sourceResponse = await getFilteredSources(interpolated, protocolType);
    } else if (queryParamLength !== 0 && typeof queryParams.mappingReq !== 'undefined') {
      let sourceMappingReqd = (queryParams.mappingReq == "true");
      clogger.log("info", "controller -> getFilteredSources -> queryParams.mappingReq -> %s", queryParams.mappingReq);
      sourceResponse = await getAllSourcesWithMappReqd(sourceMappingReqd);
    } else if (queryParamLength !== 0 && typeof queryParams.payloadType !== 'undefined') {
      let payloadType = queryParams.payloadType;
      clogger.log("info", "controller -> getFilteredSources -> queryParams.payloadType -> %s", payloadType);
      sourceResponse = await getSourcesWithObjPayload(payloadType);
    } else {
      clogger.log("info", "controller -> getFilteredSources -> no query params");
    }

    var successResponse = new SuccessResponse(constants.SUCCESS, sourceResponse);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getFilteredSources -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  common API's : get Source With Template
 * @returns successResponse : sourceWithTempResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getSourceWithTemplate = async (req, res, next) => {

  try {

    clogger.log("error", "controller -> getSourceWithTemplate -> sourceId -> REQUEST");

    let sourceId = req.params.sourceId;
    clogger.log("error", "controller -> getSourceWithTemplate -> sourceId -> %s", sourceId);
    let sourceWithTempResponse = await getSourceWithTemplate(sourceId);
    clogger.log("error", "controller -> getSourceWithTemplate -> sourceId -> %s", JSON.stringify(sourceWithTempResponse));
    var successResponse = new SuccessResponse(constants.SUCCESS, sourceWithTempResponse);
    res.status(200).send(successResponse);
    next();
  } catch (e) {
    clogger.log("error", "getSourceWithTemplate -> %s", JSON.stringify(e.message));
    res.sendStatus(500) && next(e)
  }

}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  UI Specific API's : getSourceForRightPanelById
 * @returns successResponse : sourceWithTempResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getSourceForRightPanelById = async (req, res, next) => {

  try {

    let sourceId = req.params.sourceId;
    clogger.log("info", "controller -> getSourceForRightPanelById -> sourceId : %s", sourceId);
    let source = await getSourceForRightPanelById(sourceId);

    let successResponse = new SuccessResponse(constants.SUCCESS, source);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getSourceForRightPanelById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}