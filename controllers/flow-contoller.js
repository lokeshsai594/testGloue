const { flowService } = require('../../src/services');
const { sourceService } = require('../../src/services');

const winston = require('winston');
const rtlogger = winston.loggers.get('rtlogger');


const createFlow = flowService.createFlow;
const getAllFlows = flowService.getAllFlows;
const updateFlowById = flowService.updateFlowById;
const deleteFlowById = flowService.deleteFlowById;
const getFlowForRightPanelById = flowService.getFlowForRightPanelById;
const getFlowById = flowService.getFlowById;

const getFlowStatus = flowService.getFlowStatus;    //flowStatus

const getFilteredFlows = flowService.getFilteredFlows;
const updateVNodeLinkFlag = flowService.updateVNodeLinkFlag;


//for linking to commune source from v-Node
const createSource = sourceService.createSource;

var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");

let constants = require('../utils/constants');

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description create Flow
 * @returns successResponse : flowResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.createFlow = async (req, res, next) => {
  const flowRequest = req.body;
  try {

    let flowResponse = await createFlow(flowRequest);
    rtlogger.log("info", "controller -> createFlow -> %s", JSON.stringify(flowResponse));

    var successResponse = new SuccessResponse(constants.SUCCESS, flowResponse);
    res.status(200).send(successResponse);
    next()
  } catch(e) {
    rtlogger.log("error", "controller -> createflow -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get All Flows
 * @returns successResponse : flows and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getAllFlows = async (req, res, next) => {
  try {

    let flows = await getAllFlows();
    rtlogger.log("info", "getAllFlows -> %s", JSON.stringify(flows));
    res.sendStatus(201)
    next()
  } catch (e) {
    rtlogger.log("error", "getAllFlows -> %s", JSON.stringify(e.message));
    res.sendStatus(500) && next(e)
  }
}


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description get Flow By Id
 * @returns successResponse : flows and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getFlowById = async (req, res, next) => {

  try {
     
    let flowId = req.params.flowId;
    rtlogger.log("info", "controller -> getFlowById -> flowId : %s", flowId);
    let flow = await getFlowById(flowId);
    rtlogger.log("info","controller -> getFlowById -> flow :%s",flow);
   
    //let result = {"source" : source};
    var successResponse = new SuccessResponse(constants.SUCCESS, flow);
    res.status(200).send(successResponse);
    next();
    } catch (e) {
    rtlogger.log("error", "getFlowById -> %s", JSON.stringify(e.message));
    res.sendStatus(500) && next(e);
  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description update Flow By Id
 * @returns successResponse : flow and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.updateFlowById = async (req, res, next) => {

  try {
    const flowRequest = req.body;
    let flowId = req.params.flowId;


    rtlogger.log("info", "updateFlowById -> %s", JSON.stringify(flowRequest));
    await updateFlowById(flowId, flowRequest);
    res.sendStatus(201);
    next()
  } catch (e) {
    rtlogger.log("error", "updateFlowById -> %s", JSON.stringify(e.message));
    res.sendStatus(500) && next(e)
  }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description delete Flow By Id
 * @returns successResponse : null and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.deleteFlowById = async (req, res, next) => {

  try {
    let flowId = req.params.flowId;
    rtlogger.log("info", "deleteFlowById -> %s", flowId);
    await deleteFlowById(flowId);
    res.sendStatus(201)
    next()
  } catch (e) {
    rtlogger.log("error", "deleteFlowById -> %s", JSON.stringify(e.message));
    res.sendStatus(500) && next(e)

  }
}


exports.getflowbyrightpanelId = async (req, res, next) => {
  
  try {

    //var queryParameter = req.query;
    let flowId = req.params.flowId;

    rtlogger.log("info", "controller -> getflowbyrightpanelId -> flowId : %s", flowId);
    let flowrightpanel = await getFlowForRightPanelById(flowId);
    rtlogger.log("info","controller -> getflowbyrightpanelid -> flowrightpanel :%s",flowrightpanel);

    var successResponse = new SuccessResponse(constants.SUCCESS, flowrightpanel);
    res.status(200).send(successResponse);
    next()
 
  } catch(e) {
    rtlogger.log("error", "controller -> getflowbyrightpanelId -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}




exports.getFlowStatus = async (req, res, next) => {
   
  const Request = req.body;
  let flowId = Request.flowId;
  let status = Request.status;
  let comment = Request.statusUpdateComment;
  try {

    rtlogger.log("info", "controller-> getFlowStatus - > flowId :%s and status :%s and comment: %s", flowId,status,comment);

    let successResponse = await getFlowStatus(flowId, status, comment);
    rtlogger.log("info", "controller -> getFlowStatus -> Resultflow :%s", successResponse);
     
    res.status(200).send(successResponse);
    next() 
  } catch (e) {
    rtlogger.log("error", "controller -> getFlowStatus -> error:  %s", JSON.stringify(e.message));
    res.sendStatus(500) && next(e)
  }
}



/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description  common API's : get Filtered Flows
 * @returns successResponse : flowResponse and errorResponse : error
 * @Date 03-11-2020
 * @ModifiedOn 03-11-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.getFilteredFlows = async (req, res, next) => {

  try {
    rtlogger.log("info", "controller -> getFilteredSources ->  query params ->%s", req.query);
    let flowResponse;
    let queryParams = req.query;

    let queryParamLength = Object.keys(req.query).length;

    if (queryParamLength !== 0 && typeof queryParams.isVnodeDetails !== 'undefined' && typeof queryParams.flowId !== 'undefined') {
      let isVnodeDetails = (queryParams.isVnodeDetails == "true");
      let flowId = queryParams.flowId;
      rtlogger.log("info", "controller -> getFilteredFlows -> isVnodeDetails -> %s,flowId -> %s", isVnodeDetails, flowId);
      flowResponse = await getFilteredFlows(isVnodeDetails, flowId);
    } else {
      rtlogger.log("info", "controller -> getFilteredFlows -> no query params");
    }

    var successResponse = new SuccessResponse(constants.SUCCESS, flowResponse);
    res.status(200).send(successResponse);
    next()
  } catch (e) {
    rtlogger.log("error", "controller -> getFilteredSources -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}





/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description create Flow
 * @returns successResponse : flowResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.linkToCommune = async (req, res, next) => {
  const linkRequest = req.body;
  try {

    rtlogger.log("info", "linkToCommune --> controller -> linkRequest -> %s", JSON.stringify(linkRequest));

    let sourceRequest = linkRequest.sourceData;
    let linkData = linkRequest.linkData;
    

    let sourceResponse = await createSource(sourceRequest);
    rtlogger.log("info", "linkToCommune --> controller -> createSource -> %s", JSON.stringify(sourceResponse));


    let updatedFlow = await updateVNodeLinkFlag(linkData);

    rtlogger.log("info", "linkToCommune --> controller -> updatedFlow -> %s", JSON.stringify(updatedFlow));

    var successResponse = new SuccessResponse(constants.SUCCESS, updatedFlow);
    res.status(200).send(successResponse);
    next()
  } catch(e) {
    rtlogger.log("error", "linkToCommune --> controller -> linkToCommune -> %s", JSON.stringify(e.message));
    var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
    res.status(500).send(errorResponse);
  }
}