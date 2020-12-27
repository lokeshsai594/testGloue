var mongoDB = require('../utils/mongo-connector')
const { ObjectId } = require('mongodb');

const winston = require('winston');
const clogger = winston.loggers.get('clogger');


/**
 * @author Rakshith S R
 * @description repo : get All Templates
 * @returns templates
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllTemplates = async () => {

  var conn = mongoDB.getconnection();
  let templates = await conn.collection('templates').find({}).toArray();
  clogger.log("info", "getAllTemplates -> templates : %s", JSON.stringify(templates));
  return templates;
}


/**
 * @author Rakshith S R
 * @description repo : getAll Templates With Pagination
 * @param skipValue
 * @param limitValue
 * @returns templates
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllTemplatesWithPagination = async (skipValue, limitValue) => {

  var conn = mongoDB.getconnection();
  let templates = await conn.collection('templates').find({}).skip(skipValue).limit(limitValue).toArray();
  clogger.log("info", "getAllTemplatesWithPagination -> templates : %s", JSON.stringify(templates));
  return templates;
}


/**
 * @author Rakshith S R
 * @description repo : get Template By Id
 * @param templateId
 * @returns template
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getTemplateById = async (templateId) => {

  var conn = mongoDB.getconnection();
  let template = await conn.collection('templates').findOne({ templateId: templateId });
  clogger.log("info", "getTemplateById -> templates : %s", JSON.stringify(template));
  return template;
}


/**
  * @author RAKSHITH S R
  * @description repo - creates template from templateRequest input
  * @param templateRequest 
  * @returns templateResponse
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.createTemplate = async (templateRequest) => {
  var conn = mongoDB.getconnection();
  let templateResponse = {};

  templateResponseObj = await conn.collection('templates').insertOne(templateRequest);
  templateResponse = templateResponseObj.ops[0];
  clogger.log("info", "createTemplate -> templateResponse : %s", JSON.stringify(templateResponse));
  return templateResponse;
}

/*
exports.createTemplateTwo = async (templateRequest) => {
  var conn = mongoDB.getconnection();
  await conn.collection('templates').insertOne(templateRequest,function (error, templateResponse) {
    if(error) {
      clogger.log("info", "createTemplate -> templateResponse : %s", JSON.stringify(error));
       return "ERROR";
    } else {
       clogger.log("info", "createTemplate -> templateResponse : %s", JSON.stringify(templateResponse.ops[0]));
       return templateResponse.ops[0]; 
    }
});
 
}

*/

exports.updateTemplateByIdOne = async (id, templateRequest) => {
  var conn = mongoDB.getconnection();
  let templateResponse = await conn.collection('templates').updateOne({ _id: ObjectId(id) }, { $set: templateRequest });
  clogger.log("info", "repo -> updateTemplateById -> templateResponse : %s", JSON.stringify(templateResponse));
}



/**
 * @author Rakshith S R
 * @description repo : update Template By Id
 * @param id
 * @param templateRequest
 * @returns templateResponse
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.updateTemplateById = async (id, templateRequest) => {
  var conn = mongoDB.getconnection();

  const query = { templateId: id };
  const updateRequest = { $set: templateRequest };
  const options = { returnOriginal: false };
  let templateResponseObj = await conn.collection('templates').findOneAndUpdate(query, updateRequest, options);
  clogger.log("info", "repo -> updateTemplateById -> templateResponse : %s", JSON.stringify(templateResponseObj.value));

  let templateResponse = templateResponseObj.value;
  return templateResponse;
}

/**
 * @author Rakshith S R
 * @description repo : delete Template By Id
 * @param id
 * @param templateRequest
 * @returns null
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.deleteTemplateById = async (id) => {
  var conn = mongoDB.getconnection();
  clogger.log("info", "repo -> deleteTemplateById -> id : %s", id);
  return conn.collection('templates').deleteOne({ templateId: id });

}



/**
 * @author Rakshith S R
 * @description repo : getTemplateForRightPanelById
 * @param templateId 
 * @returns templateForRightPanel
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */

exports.getTemplateForRightPanelById = async (templateId) => {

  clogger.log("info", "repo -> getTemplateForRightPanelById -> templateId : %s", templateId);

  var conn = mongoDB.getconnection();

  let matchObj = { $match: { templateId: templateId } };
  let projectForRightPanel = {
    $project:
    {
      "section_1.name": "$name",
      "section_1.description": "$description",
      "section_2": { "section_2": "$section_2" },
      "section_3.numberOfFields": { "$size": "$templateFields" },
      "section_4.createdBy": "$createdBy",
      "section_4.createdOn": "$createdOn",
      "section_4.modifiedBy": "$modifiedBy",
      "section_4.modifiedOn": "$modifiedOn"  
    }
  };


  let templates = await conn.collection('templates').aggregate([matchObj, projectForRightPanel]).toArray();
  clogger.log("info", "repo -> getTemplateForRightPanelById -> templates : %s", JSON.stringify(templates));

  let templateForRightPanel = templates[0];
  return templateForRightPanel;
}