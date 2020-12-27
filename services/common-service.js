const { docsPerMatchingFieldValue, formatTypeCheck, resourceNameForUrlCheck, tempIdForUrlCheck, uriForUrlCheck, topicForUrlCheck, uniqueIdForSourceCheck, getCollectionCount, getManageRecords, getManagePageRecords } = require('../repositories');
const winston = require('winston');
const clogger = winston.loggers.get('clogger');


var UniqueCheck = require("../models/UniqueCheck.js");


/**
 * @author RAKSHITH S R
 * @description service to check uniqueness of request values
 * @param type
 * @param values
 * @returns successResponse : uniqueCheckResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.uniqueNameCheck = async (type, values) => {
    let nameStr;

    nameStr = values.name;

    let collectionName;

    try {
        if (typeof type !== 'undefined' && type === "templateName") {
            collectionName = "templates";
        } else if (typeof type !== 'undefined' && type === "sourceName") {
            collectionName = "sources";
        } else if (typeof type !== 'undefined' && type === "sourceMappingName") {
            collectionName = "sourcemappings";
        } else if (typeof type !== 'undefined' && type === "ruleName") {
            collectionName = "rules";
        } else if (typeof type !== 'undefined' && type === "actionName") {
            collectionName = "actions";
        } else if (typeof type !== 'undefined' && type === "flowName") {
            collectionName = "flows";
        } else if (typeof type !== 'undefined' && type === "widgetName") {
            collectionName = "widgets";
        } else if (typeof type !== 'undefined' && type === "dashboardName") {
            collectionName = "dashboards";
        } else {
            clogger.log("info", "service -> uniqueNameCheck -> type not found");
            return null;
        }

        let message = type + " is unique";
        var uniqueCheckObj = new UniqueCheck(type, true, message);

        clogger.log("info", "service -> uniqueNameCheck -> nameStr : %s", nameStr);
        let size = await docsPerMatchingFieldValue(collectionName, nameStr);
        clogger.log("info", "service -> uniqueNameCheck -> size : %s", size);
        if (size > 0) {
            let message = type + " name already exists";
            uniqueCheckObj = new UniqueCheck(type, false, message);
        }
        clogger.log("info", "service -> uniqueNameCheck -> uniqueCheckObj : %s", uniqueCheckObj);

        let uniqueCheckTesponse = { uniqueCheck: uniqueCheckObj };
        return uniqueCheckTesponse;
    } catch (e) {
        clogger.log("error", "service -> uniqueNameCheck ->  %s", JSON.stringify(e.message));
        throw new Error(e.message)
    }
}


exports.formatTypeCheck = async (type) => {
    
    let doctype;
    let collectionName = "formats";
    try {
         if (typeof type !== 'undefined' && type === "dateformat") {
            doctype = "date";
        }else if (typeof type !== 'undefined' && type === "timeformat") {
            doctype = "time";
        }else if (typeof type !== 'undefined' && type === "timestamp") {
            doctype = "timestamp";
        } else {
            clogger.log("info", "service -> formatTypeCheck -> format not found");
            return null;
        }
       
        let formats = await formatTypeCheck(collectionName,doctype);
        //let formats = await formatTypeCheck(collectionName); original
        clogger.log("info", "service -> formatTypeCheckfuc -> formatsserv : %s ", formats);
        formatTypeResponse = { formats: formats };
        clogger.log("info", "service -> formatTypeCheck -> formatTypeResponse : %s ", formatTypeResponse);
        return formatTypeResponse;
    } catch(e) {
        clogger.log("error", "service -> formatTypeCheck ->  %s", JSON.stringify(e.message));
        throw new Error(e.message)
    }
}

/**
 * @author RAKSHITH S R
 * @description service to check uniqueness of request values
 * @param type
 * @param values
 * @returns successResponse : uniqueCheckTesponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.uniqueValuesCheck = async (type, values) => {


    try {

        let isExists;
        let message = "combination is unique";

        if (typeof type !== 'undefined' && type === "uriForUrl") {   //HTTP Protocal

            let url = values.url;
            let uriOrTopic = values.uri;
            let methodOrType = values.method;

            clogger.log("info", "service -> uniqueValuesCheck -> uriForUrl -> url : %s and uriOrTopic : %s and methodOrType : %s", url, uriOrTopic,methodOrType);
            isExists = await uriForUrlCheck(url, uriOrTopic,methodOrType);

        } else if (typeof type !== 'undefined' && type === "topicForUrl") {        //MQTT 

            let url = values.url;
            let uriOrTopic = values.topic;
            
            clogger.log("info", "service -> uniqueValuesCheck -> topicForUrl -> url : %s and uriOrTopic : %s", url, uriOrTopic);
            isExists = await topicForUrlCheck(url, uriOrTopic);

        } else if (typeof type !== 'undefined' && type === "url") {

            let url = values.url;
            //let templateId = values.templateId;

            clogger.log("info", "service -> uniqueValuesCheck -> url : %s", url);
            //isExists = await tempIdForUrlCheck(url, templateId);

            isExists = await tempIdForUrlCheck(url);

        } else if (typeof type !== 'undefined' && type === "resourceName") {

            let url = values.url;
            let resourceName = values.resourceName;

            clogger.log("info", "service -> uniqueValuesCheck -> url : %s and resourceName : %s", url, resourceName);
            isExists = await resourceNameForUrlCheck(url, resourceName);

        } else if (typeof type !== 'undefined' && type === "uniqueIdValue") {

            let sourceId = values.sourceId;
            let uniqueIdValue = values.uniqueIdValue;
            let uniqueKey = values.uniqueKey;

            clogger.log("info", "service -> uniqueValuesCheck -> sourceId : %s, uniqueKey : %s and uniqueIdValue : %s", sourceId, uniqueKey, uniqueIdValue);
            isExists = await uniqueIdForSourceCheck(sourceId, uniqueKey, uniqueIdValue);

        } else {
            clogger.log("error", "service -> uniqueValuesCheck type does not exists");
        }



        if (isExists) {
            message = "Duplicate entry of combination found";
        }


        let uniqueCheckObj = new UniqueCheck(type, !isExists, message);
        let uniqueCheckTesponse = { uniqueCheck: uniqueCheckObj };
        return uniqueCheckTesponse;
    } catch (e) {
        clogger.log("error", "service -> uniqueValuesCheck ->  %s", JSON.stringify(e.message));
        throw new Error(e.message)
    }
}

/**
 * @author Santosh Yadav
 * @description service to get all the records of request screen 
 * @param type
 * @param values
 * @returns successResponse : getManageRecordsResponse and errorResponse : error
 * @Date 13-05-2020
 */

exports.getManageRecords = async (type, current, rowCount, sort, searchKeys, searchPhrase) => {

    let lCollectionName;
    let lManageRecords;
    let lTotalCount;
    let lTotalPages;
    let lProject;
    let lookupObj;
    let unwindObj;
    let unwindObj1;

    try {
        if (typeof type !== 'undefined' && type === "templateName") {
            lCollectionName = "templates";
            lookupObj = {};
            unwindObj = {};
            lProject = {
                "templateName": "$name",
                "totalFields": { "$size" : "$templateFields"},
                "modifiedBy": "$createdBy",
                "id": "$templateId"
            };
            
        } else if (typeof type !== 'undefined' && type === "sourceName") {
            lCollectionName = "sources";
            lookupObj = {};
            unwindObj = {};
            lProject = {
                "sourceName": "$name",
                "protocoltype": "$protocolDetails.protocol",
                "topicOrEndpoints": { "$size": "$resourceDetails" },
                "modifiedBy": "$createdBy",
                "id": "$sourceId"
            };
            
        } else if (typeof type !== 'undefined' && type === "sourceMappingName") {
            lCollectionName = "sourcemappings";
            lookupObj = { $lookup: { "localField": "sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceDetails" } }
            unwindObj = { $unwind: "$sourceDetails" };
            lProject = {    
                "sourceMappingName": "$name",
                "sourceName": "$sourceDetails.name",
                "devicesOrServices": { "$size" : "$mappingDetails"},
                "modifiedBy": "$createdBy",
                "id": "$sourceMappingId"
            };

        } else if (typeof type !== 'undefined' && type === "ruleName") {
            lCollectionName = "rules";
            lookupObj = { $lookup: { "localField": "sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceDetails" } }
            unwindObj = { $unwind: "$sourceDetails" };
            lProject = {
                "ruleName": "$name",
                "sourceName": "$sourceDetails.name",
                "topicOrEndpoint": "$topicOrUri",
                "modifiedBy": "$createdBy",
                "id": "$ruleId"
            };

        } else if (typeof type !== 'undefined' && type === "actionName") {
            lCollectionName = "actions";
            lookupObj = {};
            unwindObj = {};
            lProject = {
                "actionName": "$name",
                "actionType": "$typeOfAction",
                "modifiedBy": "$createdBy",
                "id": "$actionId"
            };

        } else if (typeof type !== 'undefined' && type === "flowName") {
            lCollectionName = "flows";
            lookupObj = {};
            unwindObj = {};
            lProject = {
                "flowName": "$name",
                "modifiedBy": "$permissionedBy",
                "status": "$status",
                "id": "$flowId",
                "isVnode" : "$isVnode"
            };
        } else if (typeof type !== 'undefined' && type === "dashboardName") {
            lCollectionName = "dashboards";
            lookupObj = {};
            unwindObj = {};
            lProject = {
                "dashboardName": "$name",
                "status": "$status",
                "widgetsCount": { "$sum":[{"$sum": "$widgetGroupDetails.widgetCount"},"$individualWidgets.widgetCount"]},
                "createdBy": "Ajay Ramesh",
                "id": "$dashboardId"
            };
        } else if (typeof type !== 'undefined' && type === "widgetName") {
            lCollectionName = "widgets";
            lookupObj = { $lookup : { "localField": "resourceDetails.sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceDetails"}};
            unwindObj = { $unwind : "$sourceDetails" };
            unwindObj1 = { $unwind : "$sourceDetails.resourceDetails"};

            lProject = {
                
                "widgetName": "$name",
                "description": "$description",
                "sourceName": "$sourceDetails.name",
                "resourceName": "$sourceDetails.resourceDetails.name",
                "chartType": "$widgetDetails.chartType",
                "subChartType": "$widgetDetails.subChartType",
                "createdBy": "Ajay Ramesh",
                "id": "$widgetId",
                "isResourceExists": { "$cond": [{ "$eq": ["$resourceDetails.resourceId", "$sourceDetails.resourceDetails.id"] }, 1, 0] }    
                
            };
        } else {

            lCollectionName = "";
            lookupObj = {};
            unwindObj = {};
            clogger.log("info", "service -> getManageRecords -> type not found");
            return null;
        }


        let lSkipValue = rowCount * (current - 1);
        let lLimitValue = rowCount;


        clogger.log("info", "service -> getManageRecords -> collectionName : %s skipValue : %s and limitValue : %s", lCollectionName, lSkipValue, lLimitValue)
        
        if (type === "widgetName") {
            lManageRecords = await getManagePageRecords(lCollectionName, lProject, lookupObj, unwindObj, unwindObj1, sort, searchKeys, searchPhrase, lSkipValue, lLimitValue);
        } else {
            lManageRecords = await getManageRecords(lCollectionName, lProject, lookupObj, unwindObj, sort, searchKeys, searchPhrase, lSkipValue, lLimitValue);
        }

        lTotalCount = await getCollectionCount(lCollectionName);
        lTotalPages = Math.ceil(lTotalCount / rowCount);

        getManageRecordsResponse = { current: current, rowCount: rowCount, rows: lManageRecords, totalPages : lTotalPages}

        clogger.log("info", "service -> getManageRecords -> totalCount : %s and totalPages : %s", lTotalCount, lTotalPages);
        return getManageRecordsResponse;

    } catch (e) {
        clogger.log("error", "service -> getManageRecords ->  %s", JSON.stringify(e.message));
        throw new Error(e.message)
    }
}