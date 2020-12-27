const winston = require('winston');
const clogger = winston.loggers.get('clogger');

const { sourceMappingService } = require('../../src/services');


const createSourceMapping = sourceMappingService.createSourceMapping;
const getAllSourceMapping = sourceMappingService.getAllSourceMapping;
const updateSourceMappingById = sourceMappingService.updateSourceMappingById;
const deleteSourceMappingById = sourceMappingService.deleteSourceMappingById;
const getAllSourceMapWithPagination = sourceMappingService.getAllSourceMapWithPagination;
const getSourceMappingById = sourceMappingService.getSourceMappingById;
const getUniqueFieldDetails = sourceMappingService.getUniqueFieldDetails;

const getSourceMappingsForSourceId = sourceMappingService.getSourceMappingsForSourceId;
const getSourceMappingWithSource = sourceMappingService.getSourceMappingWithSource;
const getSourceMapForRightPanelById = sourceMappingService.getSourceMapForRightPanelById;

var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");

let constants = require('../utils/constants');


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description create SourceMapping
 * @returns successResponse : sourceMappingResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.createSourceMapping = async (req, res, next) => {

  try {

    const sourceMappingRequest = req.body;
    let sourceMappingResponse = await createSourceMapping(sourceMappingRequest);
    clogger.log("info", "controller -> createSourceMapping -> %s", JSON.stringify(sourceMappingResponse));
    var successResponse = new SuccessResponse(constants.SUCCESS, sourceMappingResponse);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> createSourceMapping -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get All SourceMappings
 * @returns successResponse : sourcemappings and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getAllSourceMappings = async (req, res, next) => {
  try {


    let sourcemappings = await getAllSourceMapping();
    clogger.log("info", "controller -> getAllSourceMappings -> %s", JSON.stringify(sourcemappings));
    var successResponse = new SuccessResponse(constants.SUCCESS, sourcemappings);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getAllSourceMappings -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get All SourceMap With Pagination
 * @returns successResponse : sourcemappings and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getAllSourceMapWithPagination = async (req, res, next) => {
  try {

    let queryParams = req.query;

    let pageNumber = parseInt(queryParams.page_no);
    let pageSize = parseInt(queryParams.page_size);

    clogger.log("info", "controller -> getAllSourceMapWithPagination -> pageNo : %s and pageSize : %s", pageNumber, pageSize);

    let sourcemappings = await getAllSourceMapWithPagination(pageNumber, pageSize);
    clogger.log("info", "controller -> getAllSourceMapWithPagination -> %s", JSON.stringify(sourcemappings));

    //let result = {"sources" : sources};
    var successResponse = new SuccessResponse(constants.SUCCESS, sourcemappings);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getAllTemplates -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get Source Mapping By Id
 * @returns successResponse : sourcemapping and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getSourceMappingById = async (req, res, next) => {

  try {

    let sourceMappingId = req.params.sourcemappingId;
    clogger.log("info", "controller -> getSourceMappingById -> sourceMappingId : %s", sourceMappingId);
    let sourcemapping = await getSourceMappingById(sourceMappingId);

    //let result = {"source" : source};
    var successResponse = new SuccessResponse(constants.SUCCESS, sourcemapping);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getSourceMappingById -> %s", JSON.stringify(e.message));
    res.sendStatus(500) && next(e)
  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description update Source Mapping ById
 * @returns successResponse : sourcemapping and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.updateSourceMappingById = async (req, res, next) => {

  try {
    const sourceMappingRequest = req.body;
    let sourceMappingId = req.params.sourcemappingId;

    clogger.log("info", "controller -> updateSourceMappingById -> %s", JSON.stringify(sourceMappingRequest));
    let sourcemapping = await updateSourceMappingById(sourceMappingId, sourceMappingRequest);

    var successResponse = new SuccessResponse(constants.SUCCESS, sourcemapping);
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
 * @description delete Source Mapping By Id
 * @returns successResponse : null and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.deleteSourceMappingById = async (req, res, next) => {

  try {

    let sourcemappingId = req.params.sourcemappingId;
    await deleteSourceMappingById(sourcemappingId);

    var successResponse = new SuccessResponse(constants.SUCCESS, null);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> deleteSourceMappingById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);

  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description common API's : get Filtered SourceMappings
 * @returns successResponse : sourceMappingResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getFilteredSourceMappings = async (req, res, next) => {

  try {
    clogger.log("info", "controller -> getFilteredSourceMappings ->  query params ->%s", req.query);

    let queryParams = req.query;

    let queryParamLength = Object.keys(req.query).length;

    if (queryParamLength !== 0 && typeof queryParams.sourceId !== 'undefined') {
      let sourceId = queryParams.sourceId;
      clogger.log("info", "controller -> getFilteredSourceMappings -> queryParams.sourceId -> %s", queryParams.sourceId);
      sourceMappingResponse = await getSourceMappingsForSourceId(sourceId);
    } else {
      clogger.log("info", "controller -> getFilteredSourceMappings -> no query params");
    }

    var successResponse = new SuccessResponse(constants.SUCCESS, sourceMappingResponse);
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
 * @description common API's : get Source Mapping With Source
 * @returns successResponse : sourcemappingWithSource and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getSourceMappingWithSource = async (req, res, next) => {

  try {

    let sourceMappingId = req.params.sourcemappingId;
    let sourceId = req.params.sourceId;
    clogger.log("info", "controller -> getSourceMappingWithSource -> sourceMappingId : %s and sourceMappingId : %s", sourceMappingId, sourceId);
    let sourcemappingWithSource = await getSourceMappingWithSource(sourceId, sourceMappingId);
    let successResponse = new SuccessResponse(constants.SUCCESS, sourcemappingWithSource);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getSourceMappingById -> %s", JSON.stringify(e.message));
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
exports.getSourceMapForRightPanelById = async (req, res, next) => {

  try {

    let sourcemappingId = req.params.sourcemappingId;
    clogger.log("info", "controller -> getSourceMapForRightPanelById -> sourcemappingId : %s", sourcemappingId);
    let sourcemapping = await getSourceMapForRightPanelById(sourcemappingId);

    let successResponse = new SuccessResponse(constants.SUCCESS, sourcemapping);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getSourceMapForRightPanelById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}


exports.getUniqueFieldDetails = async (req, res, next) => {

  try {

    let sourceId = req.params.sourceId;
    clogger.log("info", "controller -> getUniqueFieldDetails -> sourceId : %s", sourceId);
    let uniqueDetails = await getUniqueFieldDetails(sourceId);

    //let result = {"source" : source};
    var successResponse = new SuccessResponse(constants.SUCCESS, uniqueDetails);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getUniqueFieldDetails -> %s", JSON.stringify(e.message));
    res.sendStatus(500) && next(e)
  }
}