const { createWidget, getWidgetById, deleteWidgetById, getNextSequence, getWidgetbyrightpanelId } = require('../repositories');

const winston = require('winston');
const xlogger = winston.loggers.get('xlogger');

var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");

let constants = require('../utils/constants');


exports.createWidget = async (widgetRequest) => {

    try {
        xlogger.log("info", "service -> createWidget -> widgetRequest : %s", widgetRequest);

        let widgetResponse, createdWidget;

        let sequence = await getNextSequence("counters", "widgetId");
        xlogger.log("info", "service -> createwidget -> sequence : %s", sequence);

        widgetRequest.widgetId = "WD_" + sequence;
        widgetRequest.createdOn = new Date().toUTCString();
        xlogger.log("info", "service -> createWidget -> widgetId : %s", widgetRequest.widgetId);

        createdWidget = await createWidget(widgetRequest);
        xlogger.log("info", "service -> createWidget ->  createdWidget : %s", createdWidget);
        widgetResponse = { widget: createdWidget };
        return widgetResponse;

    } catch (e) {
        xlogger.log("error", "service -> createWidget ->  %s", JSON.stringify(e.message));
        throw new Error(e.message)
    }
}


exports.getWidgetById = async (reqId) => {

    try {
      let widgetResponse;
      xlogger.log("info", "service -> getWidgetById -> reqId :%s", reqId);
  
      let widgetbyid = await getWidgetById(reqId);
      xlogger.log("info", "service -> getWidgetById -> widgetbyid :%s", widgetbyid);
      widgetResponse = { widget : widgetbyid };
      return widgetResponse;
  
    } catch (e) {
      xlogger.log("error", "service -> getWidgetById : %s", JSON.stringify(e.message));
      throw new Error(e.message)
    }
}


exports.deleteWidgetById = async (reqId) => {

    try {
      let widgetResponse;
      xlogger.log("info", "service -> deleteWidgetById -> reqId :%s", reqId);
  
      let widgetbyid = await deleteWidgetById(reqId);
      xlogger.log("info", "service -> deleteWidgetById -> widgetbyid :%s", widgetbyid);
      widgetResponse = { result: widgetbyid };
      return widgetResponse;
  
    } catch (e) {
      xlogger.log("error", "service -> deleteWidgetById : %s", JSON.stringify(e.message));
      throw new Error(e.message)
    }
}


exports.getWidgetbyrightpanelId = async (widgetId) => {

  try {
   
    xlogger.log("info", "service -> getWidgetbyrightpanelId -> widgetId :%s", widgetId);
    let widget = await getWidgetbyrightpanelId(widgetId);
    xlogger.log("info", "service -> getWidgetbyrightpanelId -> widgetRightPanel :%s", widget);

    let widgetResponse = {  widget };
    return widgetResponse;
  } catch (e) {
    xlogger.log("error", "service -> getWidgetbyrightpanelId : %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


