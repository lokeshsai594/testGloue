const { dashboardService } = require('../../src/services');

const winston = require('winston');
const xlogger = winston.loggers.get('xlogger');


const createDashboard = dashboardService.createDashboard;
const getDashboardById = dashboardService.getDashboardById;
const latestMockData = dashboardService.latestMockData;
const getDashboardbyrightpanelId = dashboardService.getDashboardbyrightpanelId;

var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");

let constants = require('../utils/constants');


exports.createDashboard = async(req, res, next) => {

      const dashboardRequest = req.body;

    try{

        xlogger.log("info", "controller -> createDashboard -> dashboardRequest : %s", dashboardRequest);

        let dashboardResponse = await createDashboard(dashboardRequest);
        xlogger.log("info", "controller -> createDashboard -> dashboardRequest : %s", JSON.stringify(dashboardResponse));

        var successResponse = new SuccessResponse(constants.SUCCESS, dashboardResponse);
        res.status(200).send(successResponse);
        next();
    }catch(e){
        xlogger.log("error", "controller -> createDashboard -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);
    }
}


exports.getDashboardById = async (req, res, next) => {

    try {

        let reqId = req.params.dashboardId;

        xlogger.log("info", "controller -> getDashboardById -> reqId : %s", reqId);
        let dashBoard = await getDashboardById(reqId);
        xlogger.log("info", "controller -> getDashboardById -> dashboard :%s", dashBoard);

        var successResponse = new SuccessResponse(constants.SUCCESS, dashBoard);
        res.status(200).send(successResponse);
        next();
    } catch (e) {
        xlogger.log("error", "controller -> getDashboardById -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);
    }
}


exports.latestMockData = async(req, res, next) => {

    const request = req.body;

   try{

      xlogger.log("info", "controller -> latestMockData -> request : %s", request);

      let latestData = await latestMockData(request);
      xlogger.log("info", "controller -> latestMockData -> request : %s", JSON.stringify(latestData));
      res.status(200).send(latestData);
      next();
  }catch(e){
      xlogger.log("error", "controller -> createDashboard -> %s", JSON.stringify(e.message));
      var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
      res.status(500).send(errorResponse);
  }
}


exports.getDashboardbyrightpanelId = async (req, res, next) => {

    try {

        let dashboardId = req.params.dashboardId;

        xlogger.log("info", "controller -> getDashboardbyrightpanelId -> dashboardId : %s", dashboardId);
        let dashBoardRightPanel = await getDashboardbyrightpanelId(dashboardId);
        xlogger.log("info", "controller -> getDashboardbyrightpanelId -> dashBoardRightPanel :%s", dashBoardRightPanel);

        var successResponse = new SuccessResponse(constants.SUCCESS, dashBoardRightPanel);
        res.status(200).send(successResponse);
        next();
    } catch (e) {
        xlogger.log("error", "controller -> getDashboardbyrightpanelId -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);
    }
}

