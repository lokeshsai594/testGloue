const { templateService } = require('../../src/services');
let constants = require('../utils/constants');

const winston = require('winston');
const clogger = winston.loggers.get('clogger');



var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");



const createTemplate = templateService.createTemplate;
const getAllTemplates = templateService.getAllTemplates;
const getAllTemplatesWithPagination = templateService.getAllTemplatesWithPagination;
const getTemplateById = templateService.getTemplateById;
const updateTemplateById = templateService.updateTemplateById;
const deleteTemplateById = templateService.deleteTemplateById;
const getTemplateForRightPanelById = templateService.getTemplateForRightPanelById;


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description creates a template from template request
 * @returns successResponse : templateResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.createTemplate = async (req, res, next) => {

  try {
    const templateRequest = req.body;
    clogger.log("info", "controller -> createTemplate -> %s", JSON.stringify(templateRequest));
    let templateResponse = await createTemplate(templateRequest);
    clogger.log("info", "controller -> createTemplate -> %s", JSON.stringify(templateResponse));
    var successResponse = new SuccessResponse(constants.SUCCESS, templateResponse);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> createTemplate -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);

  }
}



/**
 * @author Rakshith S R
 * @param req 
 * @param res 
 * @description get All Templates
 * @returns successResponse : templates & errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllTemplates = async (req, res, next) => {
  try {

    let templates = await getAllTemplates();
    clogger.log("info", "getAllTemplates -> %s", JSON.stringify(templates));
    var successResponse = new SuccessResponse(constants.SUCCESS, templates);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "getAllTemplates -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);

  }
}


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get All Templates With Pagination
 * @returns successResponse : templates and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getAllTemplatesWithPagination = async (req, res, next) => {
  try {

    let queryParams = req.query;

    let pageNumber = parseInt(queryParams.page_no);
    let pageSize = parseInt(queryParams.page_size);

    clogger.log("info", "getAllTemplates -> pageNo : %s and pageSize : %s", pageNumber, pageSize);

    let templates = await getAllTemplatesWithPagination(pageNumber, pageSize);
    clogger.log("info", "getAllTemplates -> %s", JSON.stringify(templates));

    var successResponse = new SuccessResponse(constants.SUCCESS, templates);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "getAllTemplates -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get Template By Id
 * @returns successResponse : template and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getTemplateById = async (req, res, next) => {

  try {

    let templateId = req.params.templateId;
    clogger.log("info", "getTemplateById -> templateId : %s", templateId);
    let template = await getTemplateById(templateId);
    var successResponse = new SuccessResponse(constants.SUCCESS, template);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "getTemplateById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description update Template By Id
 * @returns successResponse : template and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.updateTemplateById = async (req, res, next) => {

  try {

    const templateRequest = req.body;
    let templateId = req.params.templateId;

    clogger.log("info", "updateTemplateById -> %s", JSON.stringify(templateRequest));
    let template = await updateTemplateById(templateId, templateRequest);
    var successResponse = new SuccessResponse(constants.SUCCESS, template);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "updateTemplateById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}





/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description delete Template By Id
 * @returns successResponse : template and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.deleteTemplateById = async (req, res, next) => {

  try {
    let templateId = req.params.templateId;
    await deleteTemplateById(templateId);
    var successResponse = new SuccessResponse(constants.SUCCESS, null);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "deleteTemplateById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);

  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  UI Specific API's : getTemplateForRightPanelById
 * @returns successResponse : template and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getTemplateForRightPanelById = async (req, res, next) => {

  try {

    let templateId = req.params.templateId;
    clogger.log("info", "controller -> getTemplateForRightPanelById -> templateId : %s", templateId);
    let template = await getTemplateForRightPanelById(templateId);

    let successResponse = new SuccessResponse(constants.SUCCESS, template);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    clogger.log("error", "controller -> getTemplateForRightPanelById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}
