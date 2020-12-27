const { getAllFlows, createFlow, updateFlowById, deleteFlowById, getNextSequence, getFlowForRightPanelById, getFlowStatus, setStatusFlowId, getFlowById,getFlowWithVnodeDetails,updateVNodeLinkFlag } = require('../repositories');

const winston = require('winston');
const rtlogger = winston.loggers.get('rtlogger');
const axios = require('axios');

const sslConfig = require('./../utils/ssl-config');



var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");

let constants = require('../utils/constants');


const config = require('./../commons/app-config.json');

/**
  * @author RAKSHITH S R
  * @description service : create Flow
  * @param flowRequest
  * @returns flowResponse : createdFlow
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.createFlow = async (flowRequest) => {
  try {

    rtlogger.log("info", "service -> createFlow -> flowRequest : %s", flowRequest);

    let flowResponse;
    let createdflow;

    let sequence = await getNextSequence("counters", "flowId");
    rtlogger.log("info", "service -> createflow -> sequence : %s", sequence);

    flowRequest.flowId = "FL_" + sequence;
    flowRequest.createdOn = new Date().toUTCString();
    rtlogger.log("info", "service -> createflow -> flowId : %s", flowRequest.flowId);

    createdflow = await createFlow(flowRequest);
    rtlogger.log("info", "service -> createflow -> createdflow : %s", createdflow);
    flowResponse = { flow: createdflow };
    return flowResponse;



    // return await createFlow(flowRequest);
  } catch (e) {
    rtlogger.log("error", "service -> createflow ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}



/**
  * @author RAKSHITH S R
  * @description service : get Flow By ID : For view More Screen
  * @returns flowResponse : flow
  * @Date 07-08-2020
  * @ModifiedOn 07-08-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getFlowById = async (flowId) => {

  try {
    let flowResponse;
    rtlogger.log("info", "service -> getFlowById -> flowId :%s", flowId);

    let flow = await getFlowById(flowId);
    rtlogger.log("info", "service -> getFlowById -> flowservice :%s", flow);
    flowResponse = { flow: flow };
    return flowResponse;

  } catch (e) {
    rtlogger.log("error", "service -> getFlowById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


/**
  * @author RAKSHITH S R
  * @description service : get All Flows
  * @returns flowResponse : flows
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getAllFlows = async () => {
  try {
    return await getAllFlows();
  } catch (e) {
    throw new Error(e.message)
  }
}


/**
  * @author RAKSHITH S R
  * @description service : update Flow By Id
  * @param id
  * @param flowRequest
  * @returns flowResponse : flows
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.updateFlowById = async (id, flowRequest) => {
  try {
    return await updateFlowById(id, flowRequest);
  } catch (e) {
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : delete Flow By Id
  * @param id
  * @returns null
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.deleteFlowById = async (id) => {
  try {
    return await deleteFlowById(id);
  } catch (e) {
    throw new Error(e.message)
  }
}



exports.getFlowForRightPanelById = async (flowId) => {

  try {
    let flowResponse;
    rtlogger.log("info", "service -> getFlowForRightPanelById -> flowId :%s", flowId);

    let flow = await getFlowForRightPanelById(flowId);
    rtlogger.log("info", "service -> getFlowForRightPanelById -> flowservice :%s", flow);
    flowResponse = { flow: flow };
    return flowResponse;

  } catch (e) {
    rtlogger.log("error", "service -> getFlowForRightPanelById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}



exports.getFlowStatus = async (flowId, status, comment) => {

  try {

    let flowResponse, flowrepo, updateddata, respn, disrespn, errapproveresp;
    let approveurl = config.approveURL;
    let rejecturl = config.disapproveURL;

    rtlogger.log("info", "service -> getFlowStatus -> flowId: %s and status: %s and comment: %s", flowId, status, comment);

    flowrepo = await getFlowStatus(flowId);
    rtlogger.log("info", "service -> getFlowStatus -> flowRepo : %s", flowrepo);


    if (status == 'Approve') {

      respn = await makePostRequest(approveurl, flowrepo);
      rtlogger.log("info", "service -> approveURL -> makePostRequest -> respn : %s", respn);
    } else if(status == 'Disapprove') {

      respn = await makePostRequest(rejecturl, flowrepo);
      rtlogger.log("info", "service -> disapproveURL -> makePostRequest -> respn : %s", respn);
    } else {
      rtlogger.log("error", "service -> getFlowStatus -> %s", "Invalid Status");
      throw new Error("Invalid Status");
    }
    
    console.log("backend service call ends.......");
    
    if (status == 'Disapprove' && (respn.statusCode == 'IOTG_002' || respn.statusCode == 'IOTG_003' || respn.statusCode == 'IOTG_005' || respn.statusCode == 'IOTG_006')) {

      updateddata = await setStatusFlowId(flowId, status, comment);   //dispprovesuccess..
      rtlogger.log("info", "service -> getFlowStatus -> Disapprove -> updateddata : %s", updateddata);
    }
    else if(status == 'Approve' && (respn.statusCode == 'IOTG_001' || respn.statusCode == 'IOTG_002' || respn.statusCode == 'IOTG_004')) {

      updateddata = await setStatusFlowId(flowId, status, comment);   //approvesuccess..
      rtlogger.log("info", "service -> getFlowStatus -> Approve -> updateddata : %s", updateddata);
    }
    else if((status == 'Approve' || status == 'Disapprove') && (respn.statusCode == 'IOTG_007' || respn.statusCode == 'IOTG_008' || respn.statusCode == 'IOTG_009' || respn.statusCode == 'IOTG_010')) {
      rtlogger.log("info", "service -> getFlowStatus -> FailedApprove/Disapprove -> respn : %s", respn);

      let errorResponse = { flowId: flowId, statusCode: respn.statusCode, statusMessage: respn.statusDescription };

      rtlogger.log("info", "service -> getFlowStatus -> FailedApprove/Disapprove -> errorResponse : %s", errorResponse);
    
      flowResponse = { flowStatus: errorResponse };
      let successResponse = new SuccessResponse(constants.FAIL, flowResponse);
      console.log(successResponse);
      return successResponse;
    } else {
      rtlogger.log("error", "service -> getFlowStatus -> %s", "Invalid Status");
      throw new Error("Invalid Status")
    }

    rtlogger.log("info", "service -> getFlowStatus -> updateddataflow: %s", updateddata);
    flowResponse = { flowStatus: updateddata };
    let successResponse = new SuccessResponse(constants.SUCCESS, flowResponse);
    console.log(successResponse);
    return successResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getFlowStatus -> error : %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}



async function makePostRequest(url, params) {

  try {

    console.log('calling the backend Service..');

    let res = await axios.post(url, params, { httpsAgent: sslConfig.mutualHTTPAgent });    //callingBackendService
    let response = res.data;
    rtlogger.log("info", "service -> getFlowStatus -> makePostRequest -> response: %s", JSON.stringify(response));
    console.log(response);
    return response;
  } catch (e) {
    rtlogger.log("error", "service -> getFlowStatus -> makePostRequest -> error: %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

exports.getFilteredFlows = async (isVnodeDetails,flowId) => {

  try {
    let flowResponse;
    rtlogger.log("info", "service -> getFilteredFlows -> isVnodeDetails :%s", isVnodeDetails);

    if(isVnodeDetails){
      
      let flow = await getFlowWithVnodeDetails(flowId);
      rtlogger.log("info", "service -> getFilteredFlows -> flowservice :%s", flow);
      flowResponse = { flow: flow };
      return flowResponse;

    }else{
      rtlogger.log("info", "service -> getFilteredFlows--> vnode is not present -> isVnodeDetails :%s", isVnodeDetails);
      flowResponse = { flow: "" };
      return flowResponse;

    }
    

  } catch (e) {
    rtlogger.log("error", "service -> getFlowForRightPanelById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}



exports.updateVNodeLinkFlag = async (linkData) => {

  try {
   
    
    rtlogger.log("info", "service -> updateVNodeLinkFlag -> linkData :%s", linkData);

    let flowId = linkData.flowId;
    let isVnodeLinked = linkData.isVnodeLinked;
    
    
      let updatedflow = await updateVNodeLinkFlag(flowId,isVnodeLinked);
      rtlogger.log("info", "service -> updateVNodeLinkFlag -> flow :%s", updatedflow);
      let flowResponse = { isVnodeLinked: updatedflow.isVnodeLinked };

      rtlogger.log("info", "service -> updateVNodeLinkFlag -> flowResponse :%s", flowResponse);
      return flowResponse;

    } catch (e) {
    rtlogger.log("error", "service -> updateVNodeLinkFlag ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}