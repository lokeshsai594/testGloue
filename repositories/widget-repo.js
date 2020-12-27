var mongoDB = require('../utils/mongo-connector');
const { ObjectId } = require('mongodb');

const winston = require('winston');
const xlogger = winston.loggers.get('xlogger');



exports.createWidget = async (widgetRequest) => {

    var conn = mongoDB.getconnection();
    let widgetObj = await conn.collection('widgets').insertOne(widgetRequest);
    let widgetResponse = widgetObj.ops[0];
    xlogger.log("info", "repo -> createWidget -> widgetResponse : %s", JSON.stringify(widgetResponse));
    return widgetResponse;
}


exports.getWidgetById = async (reqId) => {

    var conn = mongoDB.getconnection();
    let matchObj = { $match: { widgetId : reqId }};
    let lookupObj = { $lookup : { localField:'resourceDetails.sourceId', from:'sources', foreignField:'sourceId', as:'sourceIddetails'}};
    let unwindObj = { $unwind : "$sourceIddetails" };

    let projectObj = {
        $project: {
            "_id": 0,
            "id": "$_id",
            "name": 1,
            "description": 1,
            "roles": 1,    
            "resourceDetails": {
                "$map": {
                    "input": {
                        "$filter": {
                            "input": "$sourceIddetails.resourceDetails",
                            "as": "r",
                            "cond": { "$eq": ["$$r.id", "$resourceDetails.resourceId"] }
                        }
                    },
                    "as": "result",
                    "in": {
                        "source": { "sourceId": "$resourceDetails.sourceId", "name": "$sourceIddetails.name" },
                        "resource": { "name": "$$result.name", "resourceId": "$resourceDetails.resourceId" },
                        "methodOrType": "$$result.methodOrType",
                        "header": "$$result.header",
                        "payloadKeyForChart": "$resourceDetails.payloadKeyForChart",
                        "url": "$resourceDetails.url",
                        "reqJson": "$$result.requestPayload.payload",
                        "resJson": "$$result.responsePayload.payload",
                        "schema": "$$result.responsePayload.schema"
                    }
                }
            },
            "widgetDetails": 1,
            "createdBy": 1,
            "widgetId": 1,
            "createdOn": 1
        }
    };
    let unwindObj1 = { "$unwind": "$resourceDetails" };

    let result = await conn.collection('widgets').aggregate([ matchObj, lookupObj, unwindObj, projectObj, unwindObj1]).toArray();
    let resultresponse = result[0];
    xlogger.log("info", "repo -> getWidgetById -> result : %s", JSON.stringify(resultresponse));
    return resultresponse;
}


exports.deleteWidgetById = async (reqId) => {
    var conn = mongoDB.getconnection();
    let result = await conn.collection('widgets').deleteOne({ widget : reqId });
    xlogger.log("info", "repo -> deleteWidgetById -> result : %s", JSON.stringify(result));
    return result;
}



exports.getWidgetbyrightpanelId = async (widgetId) => {

    xlogger.log("info", "repo -> getWidgetbyrightpanelId -> widgetId : %s", widgetId);
    var conn = mongoDB.getconnection();

    let matchObj = { $match: { widgetId: widgetId }};
    let lookupObj = { $lookup: { localField: "resourceDetails.sourceId", from: "sources", foreignField: "sourceId", as: "sourceDetails"}};
    let unwindObj = { $unwind: "$sourceDetails"};
    let projectObj = { 
        "$project": {
            "widgetDetails":{
                "$map":{
                    "input":{
                        "$filter":{
                            "input": "$sourceDetails.resourceDetails",
                            "as": "r",
                            "cond": { "$eq": [ "$$r.id", "$resourceDetails.resourceId"]}
                        }
                    },
                    "as": "ress",
                    "in":{
                        "id": "$_id",
                        "section_1": { "name": "$name", "description": "$description"},
                        "section_2": { "sourceName": "$sourceDetails.name", "resourceName": "$$ress.name", "methodOrType": "$$ress.methodOrType" },
                        "section_3": { "chartType": "$widgetDetails.chartType", "subChartType": "$widgetDetails.subChartType"},
                        "section_4": { "createdBy": "Ajay Ramesh", "createdOn": "$createdOn", "modifiedBy": "$modifiedBy", "modifiedOn": "$modifiedOn"},
                        "section_5": { 
                           "roles": {
                              "$map": {
                                 "input": "$roles", 
                                 "as": "ress",
                                 "in": { "roleName":"$$ress"}
                                }
                            }
                        }
                    }
                }
            }
        }
    };
    
    let unwindObj1= { $unwind: "$widgetDetails" };

    let result = await conn.collection('widgets').aggregate([matchObj, lookupObj, unwindObj, projectObj, unwindObj1]).toArray();
    let response = result[0];
    xlogger.log("info", "repo -> getWidgetbyrightpanelId -> response : %s", JSON.stringify(response));
    return response.widgetDetails;
}


