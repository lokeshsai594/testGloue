const { commonService } = require('../../src/services');

let constants = require('../utils/constants');
const winston = require('winston');
const clogger = winston.loggers.get('clogger');

var SuccessResponse = require("../models/SuccessResponse.js");
var ErrorResponse = require("../models/ErrorResponse.js");


const uniqueNameCheck = commonService.uniqueNameCheck;
const uniqueValuesCheck = commonService.uniqueValuesCheck;
const getManageRecords = commonService.getManageRecords;

const formatTypeCheck = commonService.formatTypeCheck;


/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description API to check uniqueness name of sub modules 
 * @returns successResponse : uniqueCheckResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.uniqueCheck = async (req, res, next) => {

    try {
        const request = req.body;

        let type = request.type;
        let values = request.values;
        let uniqueCheckResponse;


        uniqueCheckResponse = await uniqueNameCheck(type, values);


        var successResponse = new SuccessResponse(constants.SUCCESS, uniqueCheckResponse);
        res.status(200).send(successResponse);
        next();
    } catch (e) {
        clogger.log("error", "controller -> uniqueCheck -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);

    }
}


exports.formatType = async (req, res, next) => {
   
    try{
        
        var queryParameter = req.query;
        let type = queryParameter.formatType;
        
        let formatTypeResponse;
        clogger.log("info", "controller -> formatType -> type :%s", type);
        formatTypeResponse = await formatTypeCheck(type);
        clogger.log("info", "controller -> formatType -> formatTypeResponse :%s", formatTypeResponse);
        var successResponse = new SuccessResponse(constants.SUCCESS, formatTypeResponse);
        clogger.log("info", "controller -> formatType -> successResponse :%s", successResponse);
        res.status(200).send(successResponse);
        next();
    } catch(e) {
        clogger.log("error", "controller -> formatType -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);
    }
}

/**
 * @author RAKSHITH S R
 * @param req 
 * @param res 
 * @description API to check uniqueness of combination of values
 * @returns successResponse : uniqueValuesCheckResponse and errorResponse : error
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.uniqueValuesCheck = async (req, res, next) => {

    try {
        const request = req.body;

        let type = request.type;
        let values = request.values;
        let uniqueValuesCheckResponse;

        uniqueValuesCheckResponse = await uniqueValuesCheck(type, values);

        var successResponse = new SuccessResponse(constants.SUCCESS, uniqueValuesCheckResponse);
        res.status(200).send(successResponse);
        next();
    } catch (e) {
        clogger.log("error", "controller -> uniqueCheck -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);

    }
}

/**
 * @author Santosh Yadav
 * @param req 
 * @param res 
 * @description API to get request number records depending on type 
 * @returns successResponse : getManageRecordsResponse and errorResponse : error
 * @Date 20-04-2020
 */
exports.getManageRecords = async (req, res, next) => {

    try {
        const request = req.body;
        //clogger.log("error", "controller -> getManageRecords -> %s", JSON.stringify(e.message));
        let type = request.type;
        let current = request.current;
        let rowCount = request.rowCount;
        let sort = request.sort;
        let searchKeys = request.searchKeys;
        let searchPhrase = request.searchPhrase;
        let getManageRecordsResponse;

        getManageRecordsResponse = await getManageRecords(type, current, rowCount, sort, searchKeys, searchPhrase);

        var successResponse = new SuccessResponse(constants.SUCCESS, getManageRecordsResponse);
        res.status(200).send(successResponse);
        next();
    } catch (e) {
        clogger.log("error", "controller -> getManageRecords -> %s", JSON.stringify(e.message));
        var errorResponse = new ErrorResponse(constants.ERROR, JSON.stringify(e.message));
        res.status(500).send(errorResponse);

    }
}
