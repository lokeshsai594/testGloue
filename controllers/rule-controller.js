const { ruleService } = require('../../src/services');

const winston = require('winston');
const rtlogger = winston.loggers.get('rtlogger');


const createRule = ruleService.createRule;
const getAllRules = ruleService.getAllRules;
const updateRuleById = ruleService.updateRuleById;
const deleteRuleById = ruleService.deleteRuleById;
const getAllRulesWithPagination = ruleService.getAllRulesWithPagination;
const getRuleById = ruleService.getRuleById;
const getRuleWithScriptById = ruleService.getRuleWithScriptById;
const getRuleForRightPanelById = ruleService.getRuleForRightPanelById;
const getFilteredRules = ruleService.getFilteredRules;

var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");

let constants = require('../utils/constants');


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description create Rule
 * @returns successResponse : ruleResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.createRule = async (req, res, next) => {
  const ruleRequest = req.body;
  try {


    let ruleResponse = await createRule(ruleRequest);
    rtlogger.log("info", "controller -> createRule -> %s", JSON.stringify(ruleResponse));

    var successResponse = new SuccessResponse(constants.SUCCESS, ruleResponse);
    res.status(200).send(successResponse);

    next()
  } catch (e) {
    rtlogger.log("error", "controller -> createRule -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get All Rules
 * @returns successResponse : rules and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getAllRules = async (req, res, next) => {
  try {

    let rules = await getAllRules();
    rtlogger.log("info", "controller -> getAllRules -> %s", JSON.stringify(rules));
    var successResponse = new SuccessResponse(constants.SUCCESS, rules);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> getRoles -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get All Rules With Pagination
 * @returns successResponse : rules and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getAllRulesWithPagination = async (req, res, next) => {
  try {

    let queryParams = req.query;

    let pageNumber = parseInt(queryParams.page_no);
    let pageSize = parseInt(queryParams.page_size);

    rtlogger.log("info", "controller -> getAllRulesWithPagination -> pageNo : %s and pageSize : %s", pageNumber, pageSize);

    let rules = await getAllRulesWithPagination(pageNumber, pageSize);
    rtlogger.log("info", "controller -> getAllRulesWithPagination -> rules -> %s", JSON.stringify(rules));

    //let result = {"sources" : sources};
    var successResponse = new SuccessResponse(constants.SUCCESS, rules);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> getAllRulesWithPagination -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get Rule By Id
 * @returns successResponse : rules and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getRuleById = async (req, res, next) => {

  try {
    let ruleId = req.params.ruleId;
    rtlogger.log("info", "controller -> getRuleById -> ruleId : %s", ruleId);
    let rule = await getRuleWithScriptById(ruleId);

    //let result = {"source" : source};
    var successResponse = new SuccessResponse(constants.SUCCESS, rule);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> getRoleById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description update Rule By Id
 * @returns successResponse : rule and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.updateRuleById = async (req, res, next) => {

  try {

    const ruleRequest = req.body;
    let ruleId = req.params.ruleId;


    rtlogger.log("info", "controller -> updateRoleById -> ruleRequest -> %s", JSON.stringify(ruleRequest));
    let rule = await updateRuleById(ruleId, ruleRequest);
    rtlogger.log("info", "controller -> updateRoleById -> rule -> %s", JSON.stringify(rule));

    var successResponse = new SuccessResponse(constants.SUCCESS, rule);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> updateRoleById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description delete Rule By Id
 * @returns successResponse : null and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.deleteRuleById = async (req, res, next) => {

  try {

    let ruleId = req.params.ruleId;
    rtlogger.log("info", "controller -> deleteRuleById -> %s", ruleId);
    await deleteRuleById(ruleId);
    var successResponse = new SuccessResponse(constants.SUCCESS, null);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> deleteRuleById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  UI Specific API's : getRuleForRightPanelById
 * @returns successResponse : sourceWithTempResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getRuleForRightPanelById = async (req, res, next) => {

  try {

    let ruleId = req.params.ruleId;
    rtlogger.log("info", "controller -> getRuleForRightPanelById -> ruleId : %s", ruleId);
    let rule = await getRuleForRightPanelById(ruleId);

    let successResponse = new SuccessResponse(constants.SUCCESS, rule);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> getRuleForRightPanelById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  UI Specific API's : get Filtered Rules based on input query params
 * @returns successResponse : ruleResponse and errorResponse : error
 * @Date 20-05-2020
 * @ModifiedOn 20-05-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getFilteredRules = async (req, res, next) => {

  try {
    rtlogger.log("info", "controller -> getFilteredRules ->  query params ->%s", req.query);
    let ruleResponse;
    let bodyParams = req.body;


    if (typeof bodyParams.sourceId !== 'undefined'
      && typeof bodyParams.topicOrUri !== 'undefined'
      && typeof bodyParams.status !== 'undefined'
      && typeof bodyParams.filterValue !== 'undefined' ) {

      let sourceId = bodyParams.sourceId;
      let topicOrUri = bodyParams.topicOrUri;
      let status = bodyParams.status;
      let filterValue = bodyParams.filterValue;

      rtlogger.log("info", "controller -> getFilteredRules -> sourceId -> %s,topicOrUri -> %s and status -> %s", sourceId, topicOrUri, status);
      ruleResponse = await getFilteredRules(sourceId, topicOrUri, status,filterValue);
    } else {
      rtlogger.log("info", "controller -> getFilteredRules -> no query params");
    }

    var successResponse = new SuccessResponse(constants.SUCCESS, ruleResponse);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> getFilteredRules -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}