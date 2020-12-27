const { widgetService } = require('../../src/services');

const winston = require('winston');
const xlogger = winston.loggers.get('xlogger');


const createWidget = widgetService.createWidget;
const getWidgetById = widgetService.getWidgetById;
const deleteWidgetById = widgetService.deleteWidgetById;
const getWidgetbyrightpanelId = widgetService.getWidgetbyrightpanelId;



var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");

let constants = require('../utils/constants');


exports.createWidget = async (req, res, next) => {
    
    const widgetRequest = req.body;
    try {
        
        xlogger.log("info", "controller -> createWidget -> widgetRequest : %s", widgetRequest);

        let widgetResponse = await createWidget(widgetRequest);
        xlogger.log("info", "controller -> createWidget -> widgetResponse : %s", JSON.stringify(widgetResponse));

        var successResponse = new SuccessResponse(constants.SUCCESS, widgetResponse);
        res.status(200).send(successResponse);
        next();
    } catch (e) {
        xlogger.log("error", "controller -> createwidget -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);
    }
}



exports.getWidgetById = async (req, res, next) => {

    try {

        let reqId = req.params.widgetId;

        xlogger.log("info", "controller -> getWidgetById -> reqId : %s", reqId);
        let widget = await getWidgetById(reqId);
        xlogger.log("info", "controller -> getWidgetById -> widget :%s", widget);

        var successResponse = new SuccessResponse(constants.SUCCESS, widget);
        res.status(200).send(successResponse);
        next();
    } catch (e) {
        xlogger.log("error", "controller -> getWidgetById -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);
    }
}


exports.deleteWidgetById = async (req, res, next) => {

    try {

        let reqId = req.params.widgetId;

        xlogger.log("info", "controller -> deleteWidgetById -> reqId : %s", reqId);
        let widget = await deleteWidgetById(reqId);
        xlogger.log("info", "controller -> deleteWidgetById -> widget :%s", widget);

        var successResponse = new SuccessResponse(constants.SUCCESS, widget);
        res.status(200).send(successResponse);
        next();
    } catch (e) {
        xlogger.log("error", "controller -> deleteWidgetById -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);
    }
}


exports.getWidgetbyrightpanelId = async (req, res, next) => {

    try {

        let widgetId = req.params.widgetId;

        xlogger.log("info", "controller -> getWidgetbyrightpanelId -> widgetId : %s", widgetId);
        let widgetByRightPanel = await getWidgetbyrightpanelId(widgetId);
        xlogger.log("info", "controller -> getWidgetbyrightpanelId -> widgetByRightPanel :%s", widgetByRightPanel);

        var successResponse = new SuccessResponse(constants.SUCCESS, widgetByRightPanel);
        res.status(200).send(successResponse);
        next();
    } catch (e) {
        xlogger.log("error", "controller -> getWidgetbyrightpanelId -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);
    }
}


