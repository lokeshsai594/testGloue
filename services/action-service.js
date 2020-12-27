const { createAction, getAllActions, getActionById, updateActionById, deleteActionById, getCollectionCount, getNextSequence,getActionForRightPanelById,getFilteredActions, actiondetailswithtype } = require('../repositories')
const winston = require('winston');
const rtlogger = winston.loggers.get('rtlogger');


/**
  * @author RAKSHITH S R
  * @description service : create Action
  * @param actionRequest
  * @returns actionResponse : createdAction
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.createAction = async (actionRequest) => {
  try {

    let actionResponse;
    let createdAction;

    let sequence = await getNextSequence("counters", "actionId");
    actionRequest.actionId = "AC_" + sequence;
    actionRequest.createdOn = new Date().toUTCString();
    

    rtlogger.log("info", "service -> createAction -> actionId : %s", actionRequest.actionId);
    createdAction = await createAction(actionRequest);

    actionResponse = { action: createdAction };
    return actionResponse;
  } catch (e) {
    rtlogger.log("error", "service -> createdAction ->  %s", JSON.stringify(e.message));
    throw new Error(e.message);
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get All Actions
  * @returns actionResponse : actions
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getAllActions = async () => {
  try {

    let actions;
    let actionResponse;

    actions = await getAllActions();
    rtlogger.log("info", "service -> getAllActions -> actions : %s ", actions);
    actionResponse = { actions: actions };
    return actionResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getAllActions ->  %s", JSON.stringify(e.message));
    throw new Error(e.message);
  }
}


/**
  * @author RAKSHITH S R
  * @description service : get Action By Id
  * @param actionId
  * @returns actionResponse : action
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getActionById = async (actionId) => {
  try {

    let actionResponse;
    let action;
    rtlogger.log("info", "service -> getActionById -> actionId : %s", actionId);
    action = await getActionById(actionId);
    rtlogger.log("info", "service -> getActionById -> action : %s ", action);
    actionResponse = { action: action };
    return actionResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getActionById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : update Action By Id
  * @param id
  * @param actionRequest
  * @returns actionResponse : updatedAction
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.updateActionById = async (id, actionRequest) => {
  try {
    let actionResponse;
    let updatedAction;

    actionRequest.modifiedOn = new Date();

    rtlogger.log("info", "service -> updateActionById -> sourceRequest : %s", actionRequest);
    updatedAction = await updateActionById(id, actionRequest);
    rtlogger.log("info", "service -> updateActionById -> updatedAction : %s ", updatedAction);
    actionResponse = { action: updatedAction };
    return actionResponse;

  } catch (e) {
    rtlogger.log("error", "service -> updateSourceById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


/**
  * @author RAKSHITH S R
  * @description service : delete Action By Id
  * @param id
  * @param null
  * @returns actionResponse : updatedAction
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.deleteActionById = async (id) => {
  try {
    rtlogger.log("info", "service -> deleteActionById -> id : %s", id);
    return await deleteActionById(id);
  } catch (e) {
    rtlogger.log("error", "service -> deleteActionById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get Action For Right Panel By actionId
  * @param actionId
  * @returns actionResponse : action
  * @Date 13-05-2020
  * @ModifiedOn 13-05-2020
  * @ModifiedBy RAKSHITH S R
  */
 exports.getActionForRightPanelById = async (actionId) => {
  try {

    let actionResponse;
    let action;
    rtlogger.log("info", "service -> getActionForRightPanelById -> actionId : %s", actionId);
    action = await getActionForRightPanelById(actionId);
    rtlogger.log("info", "service -> getActionForRightPanelById -> action : %s ", action);
    actionResponse = { action: action };
    return actionResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getActionForRightPanelById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


/**
  * @author RAKSHITH S R
  * @description service : get Filtered Actions
  * @param actionId
  * @returns actionResponse : action
  * @Date 20-05-2020
  * @ModifiedOn 20-05-2020
  * @ModifiedBy RAKSHITH S R
  */
 exports.getFilteredActions = async (actionType,sourceId,status) => {
  try {

    let actionResponse;
    let action;
    rtlogger.log("info", "service -> getFilteredActions -> actionType : %s,sourceId : %s", actionType,sourceId);
   
    action = await getFilteredActions(actionType,sourceId,status);
    rtlogger.log("info", "service -> getFilteredActions -> actionType : %s and sourceId : %s ", actionType);
    actionResponse = { action: action };
    return actionResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getFilteredActions ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}



exports.actiondetailswithtypeofAction = async (actionId) => {
  
  try {
    
    let action;
    rtlogger.log("info", "service -> actiondetailswithtypeofAction -> actionType : %s", actionId);
      
    action = await actiondetailswithtype(actionId);      
    rtlogger.log("info", "service -> actiondetailswithtype -> actionResponse : %s ", action);

    actionresultresp = { action: action };  
    rtlogger.log("info", "service -> actiondetailswithtype -> actionresultresp : %s ", actionresultresp);
    console.log(actionresultresp);
    return actionresultresp;   
    console.log(actionId);
  } catch(e) {
    rtlogger.log("error", "service -> actiondetailswithtypeofAction ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


