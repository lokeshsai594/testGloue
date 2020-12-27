const { createDashboard, getNextSequence , getDashboardById, latestMockData, getDashboardbyrightpanelId} = require('../repositories');

const winston = require('winston');
const xlogger = winston.loggers.get('xlogger');

var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");

let constants = require('../utils/constants');


exports.createDashboard = async ( dashboardRequest ) => {

    try{
        xlogger.log("info", "service -> createDashboard -> dashboardRequest : %s", dashboardRequest);

        let dashboardResponse, createdDashboard;

        let sequence = await getNextSequence("counters", "dashboardId");
        xlogger.log("info", "service -> createDashboard -> sequence : %s", sequence);

        dashboardRequest.dashboardId = "DA_" + sequence;
        dashboardRequest.createdOn = new Date().toUTCString();
        xlogger.log("info", "service -> dashboardRequest -> dashboardId : %s", dashboardRequest.dashboardId);

        createdDashboard = await createDashboard(dashboardRequest);

        xlogger.log("info", "service -> createDashboard ->  created_Dashboard : %s", createdDashboard);
        dashboardResponse = { result: createdDashboard };
        return dashboardResponse;
    }catch(e){
        xlogger.log("error", "service -> createDashboard ->  %s", JSON.stringify(e.message));
        throw new Error(e.message)
    }
}


exports.getDashboardById = async (reqId) => {

    try {
      let dashboardResponse;
      xlogger.log("info", "service -> getDashboardById -> reqId :%s", reqId);
  
      let dashboardbyid = await getDashboardById(reqId);
      xlogger.log("info", "service -> getDashboardById -> dashboardbyid :%s", dashboardbyid);
      dashboardResponse = { result: dashboardbyid };
      return dashboardResponse;
  
    } catch (e) {
      xlogger.log("error", "service -> getDashboardById : %s", JSON.stringify(e.message));
      throw new Error(e.message)
    }
}


exports.latestMockData = async ( request ) => {

    try{

        devicesArr = request.devices.split(",");
        xlogger.log("info", "service -> latestData -> request : %s", devicesArr);
        let latestData = await latestMockData(devicesArr);

        xlogger.log("info", "service -> latestData ->  latestData : %s", latestData);
        return latestData;
    }catch(e){
        xlogger.log("error", "service -> latestData ->  %s", JSON.stringify(e.message));
        throw new Error(e.message)
    }
}


exports.getDashboardbyrightpanelId = async (dashboardId) => {

    try {
      
      xlogger.log("info", "service -> getDashboardbyrightpanelId -> dashboardId :%s", dashboardId);
  
      let dashBoardRightPanel = await getDashboardbyrightpanelId(dashboardId);
      xlogger.log("info", "service -> getDashboardbyrightpanelId -> dashBoardRightPanel :%s", dashBoardRightPanel);

      let dashboardResponse = { dashboard: dashBoardRightPanel };
      return dashboardResponse;  
    } catch (e) {
      xlogger.log("error", "service -> getDashboardbyrightpanelId : %s", JSON.stringify(e.message));
      throw new Error(e.message);
    }
}