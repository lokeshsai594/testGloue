var mongoDB = require('../utils/mongo-connector');
const { ObjectId } = require('mongodb');

const winston = require('winston');
const xlogger = winston.loggers.get('xlogger');


exports.createDashboard = async (dashboardRequest) => {

    var conn = mongoDB.getconnection();
    let dashboardObj = await conn.collection('dashboards').insertOne(dashboardRequest);
    let dashboardResponse = dashboardObj.ops[0];
    xlogger.log("info", "repo -> createDashboard -> dashboardResponse : %s", JSON.stringify(dashboardResponse));
    return dashboardResponse;
}


exports.getDashboardById = async (reqId) => {
    var conn = mongoDB.getconnection();
    let result = await conn.collection('dashboards').findOne({ dashboardId : reqId });
    xlogger.log("info", "repo -> getDashboardById -> result : %s", JSON.stringify(result));
    return result;
}


/**
 * @author Rakshith S R
 * @description repo :get All Actions
 * @returns actions
 * @Date 17-09-2020
 * @ModifiedOn 17-09-2020
 * @ModifiedBy Rakshith S R
 */
exports.latestMockData = async (devicesArr) => {
    
    var conn = mongoDB.getconnection();

    let deviceIdFilter = { "deviceId" : { $in: devicesArr } };
    let latestMockData = await conn.collection('analytics').find(deviceIdFilter).project({ _id: 0}).toArray();
    xlogger.log("info", "repo -> latestMockData -> latestMockData : %s", JSON.stringify(latestMockData));
    return latestMockData;
}


exports.getDashboardbyrightpanelId = async (dashboardId) => {

    xlogger.log("info", "repo -> getDashboardbyrightpanelId -> dashboardId : %s", dashboardId);
    var conn = mongoDB.getconnection();

    let matchObj = { $match: { dashboardId: dashboardId }};
    let projectObj = { 
        $project:{
            "_id": 0,
            "id": "$_id",
            "section_1": {"name": "$name", "description": "$description"},
            "section_2": { "status": "$status" },
            // "section_3": { "numOfWidgetGroups": "$widgetGroupCount", "numOfIndividualWidgets": "$individualWidgets.widgetCount", "numOfWidgets": {"$sum": "$widgetGroupDetails.widgetCount"}},
            "section_3": { "numOfWidgetGroups": "$widgetGroupCount", "numOfWidgets": { "$sum":[{"$sum": "$widgetGroupDetails.widgetCount"},"$individualWidgets.widgetCount"]} },
            "section_4": { "createdBy": "Ajay Ramesh", "createdOn": "$createdOn", "modifiedBy": "$modifiedBy", "modifiedOn": "$modifiedOn"},
            "section_5.roles":{
                "$map":{
                  "input": "$roles", 
                  "as": "ress",
                  "in": { "roleName":"$$ress"}
                }
            }
        }
    };

    let result = await conn.collection('dashboards').aggregate([ matchObj, projectObj ]).toArray();
    let response = result[0];
    xlogger.log("info", "repo -> getDashboardbyrightpanelId -> result : %s", JSON.stringify(response));
    return response;
}
