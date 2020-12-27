var mongoDB = require('../utils/mongo-connector');
const { ObjectId } = require('mongodb');
const winston = require('winston');
const clogger = winston.loggers.get('clogger');


/**
 * @author Rakshith S R
 * @description repo :get no documents in collection
 * @param collectionName
 * @returns count
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getCollectionCount = async (collectionName) => {
    var conn = mongoDB.getconnection();
    let count = await conn.collection(collectionName).count({});
    clogger.log("info", "getCollectionCount -> collectionName : %s and count : %s", collectionName, count);
    return count;
}

exports.formatTypeCheck = async (collectionName,doctype) => {
    var conn = mongoDB.getconnection();
    let formatTypes = await conn.collection(collectionName).find({"formatType":doctype}).toArray();
    //let formatTypes = await conn.collection(collectionName).find({}).toArray();
    clogger.log("info", "formatType -> collectionName : %s", JSON.stringify(formatTypes));
    return formatTypes;
}

/**
 * @author Rakshith S R
 * @description repo :get next sequence for primary key for particular collection
 * @param collectionName
 * @returns count
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getNextSequence = async (collectionName, collectionKey) => {
    var conn = mongoDB.getconnection();

    const query = { _id: collectionKey };
    const update = { $inc: { seq: 1 } };
    const options = { returnOriginal: false };

    let updateCounter = await conn.collection(collectionName).findOneAndUpdate(query, update, options);
    let updatedSeq = updateCounter.value.seq;

    clogger.log("info", "getNextSequence -> collectionName : %s and counter : %s", collectionName, updatedSeq);
    return updatedSeq;




}



/**
 * @author RAKSHITH S R
 * @description repo to docs per matching field Value
 * @returns size of documents for matching values
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy RAKSHITH S R
 */
exports.docsPerMatchingFieldValue = async (collectionName, nameStr) => {
    var conn = mongoDB.getconnection();
    let nameStrLower =  nameStr.toLowerCase();

    //let regexMatch =  { $regex: new RegExp("/^"+nameStrLower+"$/", "i") };
    //let regexName =  new RegExp(nameStr, "i");
    //elementName =  {$elemMatch: { $regex: nameStr, $options: 'i' }};

    let projectQuery = {"$project":{ "lowerName": { "$toLower": "$name" } }};
    let matchQuery = { "$match": { "lowerName": nameStrLower}};
    let docs = await conn.collection(collectionName).aggregate([projectQuery, matchQuery]).toArray();
   
    //let docs = await conn.collection(collectionName).find({ name: elementName }).toArray();
    clogger.log("info", "uniqueNameCheck -> collectionName : %s and nameStrLower : %s and No. of objects : %s", collectionName, nameStrLower, docs.length);
    let size = docs.length;
    return size;
}


/**
 * @author Rakshith S R
 * @description repo : checks uriOrTopic for particular url
 * @param url
 * @param uriOrTopic
 * @param methodOrType
 * @returns true/false
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.uriForUrlCheck = async (url, uriOrTopic, methodOrType) => {

    var conn = mongoDB.getconnection();

    let unwindObj = { $unwind: "$resourceDetails" };
    let filterObj = { "$match": { "$and": [{ "url": url }, { "resourceDetails.uriOrTopic": uriOrTopic }, { "resourceDetails.methodOrType": methodOrType }] } };
    
    let docs = await conn.collection("sources").aggregate([unwindObj, filterObj]).toArray();
    clogger.log("info", "repo -> uriOrTopicForUrlCheck -> uriForUrl : %s and uriOrTopic : %s and No. of objects matched : %s", url, uriOrTopic, docs.length);
    let size = docs.length;
    console.log(size);
    return size > 0;
}


exports.topicForUrlCheck = async (url, uriOrTopic) => {

    let topicStrLower =  uriOrTopic.toLowerCase();
    var conn = mongoDB.getconnection();

    let unwindObj = { $unwind: "$resourceDetails" };
    let matchch = { $match : { "protocolDetails.protocol": "MQTT" }};
    let toLower = { $project: { "resourceDetails.uriOrTopic": { "$toLower": "$resourceDetails.uriOrTopic" } , "url": url }};
    let matchQuery = { $match: { $and : [ { "resourceDetails.uriOrTopic": topicStrLower }, { "url" : url }]}};

    let docs = await conn.collection("sources").aggregate([ unwindObj,matchch, toLower, matchQuery  ]).toArray();
    
    clogger.log("info", "repo -> topicForUrlCheck -> Resultdocs : %s ", JSON.stringify(docs));
    clogger.log("info", "repo -> topicForUrlCheck -> uriForUrl : %s and uriOrTopic : %s and No. of objects matched : %s", url, uriOrTopic, docs.length);
    let size = docs.length;
    return size > 0;
}




/**
 * @author Rakshith S R
 * @description repo : checks templateId for particular url
 * @param url
 * @returns true/false
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.tempIdForUrlCheck = async (url) => {


    //let filterObj = { "$match": { "$and": [{ "templateId": templateId }, { "url": url }] } };
    let filterObj = { "$match": { "url": url } };
    var conn = mongoDB.getconnection();
    let docs = await conn.collection("sources").aggregate([filterObj]).toArray();
    clogger.log("info", "uriOrTopicForUrlCheck -> url : %s and No. of objects : %s", url, docs.length);
    let size = docs.length;
    return size > 0;
}


/**
 * @author Rakshith S R
 * @description repo : checks resourceName for particular url
 * @param url
 * @param resourceName
 * @returns true/false
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.resourceNameForUrlCheck = async (url, resourceName) => { // revisit

    let unwindObj = { $unwind: "$resourceDetails" };
    let filterObj = { "$match": { "$and": [{ "resourceDetails.name": resourceName }, { "url": url }] } };
    var conn = mongoDB.getconnection();
    let docs = await conn.collection("sources").aggregate([unwindObj, filterObj]).toArray();
    clogger.log("info", "resourceNameUrlCheck -> url : %s and resourceName : %s and No. of objects : %s", url, resourceName, docs.length);
    let size = docs.length;
    return size > 0;
}



exports.uniqueIdForSourceCheckOne = async (sourceId, uniqueIdValue) => { // revisit
    let unwindObj = { $unwind: "$resourceDetails" };
    let filterObj = { "$match": { "$and": [{ "resourceDetails.uniqueKey": uniqueIdValue }, { "sourceId": sourceId }] } };
    var conn = mongoDB.getconnection();
    let docs = await conn.collection("sources").aggregate([filterObj]).toArray();
    clogger.log("info", "uniqueIdForSourceCheck -> sourceId : %s and uniqueIdValue : %s and No. of objects : %s", sourceId, uniqueIdValue, docs.length);
    let size = docs.length;
    return size > 0;
}


/**
 * @author Rakshith S R
 * @description repo : checks uniqueIdValue for particular sourceId
 * @param sourceId
 * @param uniqueKey
 * @param uniqueIdValue
 * @returns true/false
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.uniqueIdForSourceCheck = async (sourceId, uniqueKey, uniqueIdValue) => { // revisit
    let uniqueValue = uniqueIdValue;
    let uniquekey = uniqueKey;
    let filterObj = { "$match": { "$and": [{ "mappingDetails": { "$elemMatch": { [uniquekey]: uniqueValue } } }, { "sourceId": sourceId }] } };
    let project = { $project: { "sourceId": 1, "uniqueKey": 1, "mappingDetails": 1 } };

    var conn = mongoDB.getconnection();
    let docs = await conn.collection("sourcemappings").aggregate([filterObj]).toArray();
    clogger.log("info", "uniqueIdForSourceCheck -> sourceId : %s and uniqueIdValue : %s and No. of objects : %s", sourceId, uniqueIdValue, docs.length);
    let size = docs.length;
    return size > 0;
}



/**
 * @author Santosh Yadav
 * @description repo : get All Manage Records 
 * @param skipValue
 * @param limitValue
 * @returns filterrecords
 * @Date 13-05-2020
 */

lookupObj = {};
unwindObj = {};

exports.getManageRecords = async (collectionName, project, lookupObj,  unwindObj, sort, searchKeys, searchPhrase, skipValue, limitValue) => {
    
    let projectAllRecord = {
        $project: project
    };
 
    var mysort = { "_id": -1 };  
    var conn = mongoDB.getconnection();
    let filterrecords;

    if (Object.keys(lookupObj).length === 0) {

        filterrecords = await conn.collection(collectionName).aggregate([projectAllRecord]).sort(mysort).skip(skipValue).limit(limitValue).toArray();
    } else {
        filterrecords = await conn.collection(collectionName).aggregate([lookupObj, unwindObj, projectAllRecord]).sort(mysort).skip(skipValue).limit(limitValue).toArray();

    }

    clogger.log("info", "repo -> getManageRecords -> filterrecords : %s", JSON.stringify(filterrecords));
    return filterrecords;
}



exports.getManagePageRecords = async (collectionName, project, lookupObj,  unwindObj, unwindObj1, sort, searchKeys, searchPhrase, skipValue, limitValue) => {
    
    let projectAllRecord = {
        $project: project
    };
 
    var mysort = { "_id": -1 };  
    var conn = mongoDB.getconnection(); 

    let resourceMatchObj = { "$match": { "isResourceExists": 1 } };
        
    let filterrecords = await conn.collection(collectionName).aggregate([lookupObj, unwindObj,unwindObj1,  projectAllRecord,  resourceMatchObj]).sort(mysort).skip(skipValue).limit(limitValue).toArray();
    
    clogger.log("info", "repo -> getManagePageRecords -> FilterRecords : %s", JSON.stringify(filterrecords));
    return filterrecords;
}