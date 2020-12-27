const { actionService } = require('../../src/services');
const Action = require('./../models/Action');
const winston = require('winston');
const rtlogger = winston.loggers.get('rtlogger');
let constants = require('../utils/constants');

var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");

const createAction = actionService.createAction;
const getAllActions = actionService.getAllActions;
const updateActionById = actionService.updateActionById;
const deleteActionById = actionService.deleteActionById;
const getActionById = actionService.getActionById;
const getActionForRightPanelById = actionService.getActionForRightPanelById;
const getFilteredActions = actionService.getFilteredActions;

const actiondetailswithtypeofAction = actionService.actiondetailswithtypeofAction;



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description create Action
 * @returns successResponse : actionResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.createAction = async (req, res, next) => {
  const actionRequest = req.body;
  try {


    let actionResponse = await createAction(actionRequest);
    rtlogger.log("info", "controller -> createAction -> %s", JSON.stringify(actionResponse));
    var successResponse = new SuccessResponse(constants.SUCCESS, actionResponse);
    res.status(200).send(successResponse);
    next();
  } catch (e) {
    rtlogger.log("error", "controller -> createAction -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get All Actions
 * @returns successResponse : actions and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getAllActions = async (req, res, next) => {
  try {

    let actions = await getAllActions();
    rtlogger.log("info", "controller -> getAllActions -> %s", JSON.stringify(actions));
    var successResponse = new SuccessResponse(constants.SUCCESS, actions);
    res.status(200).send(successResponse);
    next();
  } catch (e) {
    rtlogger.log("error", "controller -> getAllActions -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get Action By Id
 * @returns successResponse : action and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getActionById = async (req, res, next) => {

  try {
    let actionId = req.params.actionId;
    rtlogger.log("info", "controller -> getActionById -> actionId : %s", actionId);
    let action = await getActionById(actionId);

    //let result = {"source" : source};
    var successResponse = new SuccessResponse(constants.SUCCESS, action);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> getActionById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description update Action By Id
 * @returns successResponse : action and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.updateActionById = async (req, res, next) => {

  try {

    const actionRequest = req.body;
    let actionId = req.params.actionId;


    rtlogger.log("info", "controller -> updateActionById -> actionRequest -> %s", JSON.stringify(actionRequest));
    let action = await updateActionById(actionId, actionRequest);
    rtlogger.log("info", "controller -> updateActionById -> action -> %s", JSON.stringify(action));

    var successResponse = new SuccessResponse(constants.SUCCESS, action);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> updateActionById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}




/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description delete Action By Id
 * @returns successResponse : action and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.deleteActionById = async (req, res, next) => {

  try {

    let actionId = req.params.actionId;
    rtlogger.log("info", "controller -> deleteActionById -> %s", actionId);
    await deleteActionById(actionId);
    var successResponse = new SuccessResponse(constants.SUCCESS, null);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> deleteActionById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}




/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get Action For Right Panel By actionId
 * @returns successResponse : action and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getActionForRightPanelById = async (req, res, next) => {

  try {
    let actionId = req.params.actionId;
    rtlogger.log("info", "controller -> getActionForRightPanelById -> actionId : %s", actionId);
    let action = await getActionForRightPanelById(actionId);

    var successResponse = new SuccessResponse(constants.SUCCESS, action);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> getActionForRightPanelById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get Filtered Actions
 * @returns successResponse : action and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getFilteredActions = async (req, res, next) => {

  try {
    rtlogger.log("info", "controller -> getFilteredActions ->  query params ->%s", req.query);
    let ruleResponse;
    let queryParams = req.query;

    let queryParamLength = Object.keys(req.query).length;

    if (queryParamLength !== 0
      && typeof queryParams.actionType !== 'undefined'
      && typeof queryParams.sourceId !== 'undefined'
      && typeof queryParams.status !== 'undefined') {

      let sourceId = queryParams.sourceId;
      let actionType = queryParams.actionType;
      let status = queryParams.status;
     

      rtlogger.log("info", "controller -> getFilteredActions -> sourceId -> %s,actionType -> %s,status -> %s", sourceId, actionType,status);
      ruleResponse = await getFilteredActions(actionType,sourceId,status);
    } else if(queryParamLength !== 0 && typeof queryParams.actionId !== 'undefined' ){
      let actionId = queryParams.actionId;

      rtlogger.log("info", "controller -> getFilteredActions -> actionId -> %s", actionId);
      ruleResponse = await actiondetailswithtypeofAction(actionId);
      rtlogger.log("info", "controller -> getFilteredActions -> ruleResponse -> %s", ruleResponse);
    } else {
      rtlogger.log("info", "controller -> getFilteredRules -> no query params");
    }

    var successResponse = new SuccessResponse(constants.SUCCESS, ruleResponse);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> getActionById -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}



// exports.getactiondetailswithtype = async (req, res, next ) => {      //getsthedataoftypeofaction
  
  
//   try {

//     rtlogger.log("info", "controller -> getactiondetailswithtype ->  query params ->%s", req.query);
//     let queryParams = req.query;
//     let actionresultresp;
    
//     let queryparLength = Object.keys(req.query).length;

//     if (queryparLength !== 0
//       && typeof queryParams.actionId !== 'undefined') {
//       let actionId = queryParams.actionId;
  
//       rtlogger.log("info", "controller -> getactiondetailswithtype -> actionId -> %s", actionId);
//       actionresultresp = await actiondetailswithtypeofAction(actionId);
//     } else {
//       rtlogger.log("info", "controller -> getactiondetailswithtype -> noquery params");
//     }
     
//    rtlogger.log("info", "controller -> getactiondetailswithtype -> actionresultresp -> %s", actionresultresp);
//    var successResponse = new SuccessResponse(constants.SUCCESS, actionresultresp);
//    rtlogger.log("info", "controller -> getactiondetailswithtype -> successResponse -> %s", successResponse);
//    res.status(200).send(successResponse);
//    next();
//   } catch(e) {
//     rtlogger.log("error", "controller -> getactiondetailswithtype -> %s", JSON.stringify(e.message));
//     var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
//     res.status(500).send(errorResponse);
//   }
// }