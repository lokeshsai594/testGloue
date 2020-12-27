const { getAllTemplates, createTemplate, getTemplateById, updateTemplateById, deleteTemplateById, getAllTemplatesWithPagination, getNextSequence, getCollectionCount,getTemplateForRightPanelById} = require('../repositories');
const winston = require('winston');
const clogger = winston.loggers.get('clogger');



/**
  * @author RAKSHITH S R
  * @description service : creates template from templateRequest input
  * @param templateRequest 
  * @returns templateResponse
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.createTemplate = async (templateRequest) => {
  try {
    let templateResponse;
    let createdtemplate;

    let sequence = await getNextSequence("counters", "templateId");
    templateRequest.templateId = "TL_" + sequence;
    templateRequest.createdOn = new Date().toUTCString();
    clogger.log("info", "service -> createTemplate -> templateId : %s", templateRequest.templateId);
    createdtemplate = await createTemplate(templateRequest);

    templateResponse = { template: createdtemplate };
    return templateResponse;
  } catch (e) {
    clogger.log("error", "service -> createTemplate ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : getAll Templates With Pagination
  * @param pageNumber
  * @param pageSize
  * @returns templateResponse
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getAllTemplatesWithPagination = async (pageNumber, pageSize) => {
  try {

    let templateResponse;
    let totalCount;
    let templates;
    let totalPages;

    let skipValue = pageSize * (pageNumber - 1);
    let limitValue = pageSize;

    clogger.log("info", "service -> getAllTemplatesWithPagination -> skipValue : %s and limitValue : %s", skipValue, limitValue);
    templates = await getAllTemplatesWithPagination(skipValue, limitValue);


    //pagination related
    totalCount = await getCollectionCount("templates");
    totalPages = Math.ceil(totalCount / pageSize);
    templateResponse = { templates: templates, totalPages: totalPages };

    clogger.log("info", "service -> getAllTemplatesWithPagination -> totalCount : %s and totalPages : %s", totalCount, totalPages);
    return templateResponse;

  } catch (e) {
    clogger.log("error", "service -> getAllTemplatesWithPagination ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


/**
 * @author Rakshith S R
 * @description service : get All Templates
 * @returns templates
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllTemplates = async () => {
  try {

    let templates;
    templates = await getAllTemplates();
    clogger.log("info", "service -> getAllTemplates -> templates : %s ", templates);
    templateResponse = { templates: templates };
    return templateResponse;
  } catch (e) {
    clogger.log("error", "service -> getAllTemplates ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get Template By Id 
  * @param templateId
  * @returns templateResponse
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getTemplateById = async (templateId) => {
  try {

    let templateResponse;
    clogger.log("info", "service -> getTemplateById -> templateId : %s", templateId);
    let template = await getTemplateById(templateId);
    clogger.log("info", "service -> getTemplateById -> template : %s ", template);

    templateResponse = { template: template };
    return templateResponse;
  } catch (e) {
    clogger.log("error", "service -> getTemplateById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : update Template By Id
  * @param id
  * @param templateRequest
  * @returns templateResponse
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.updateTemplateById = async (id, templateRequest) => {
  try {

    templateRequest.modifiedOn = new Date();
    clogger.log("info", "service -> updateTemplateById -> templateRequest : %s", templateRequest);
    let updatedTemplate = await updateTemplateById(id, templateRequest);
    clogger.log("info", "service -> updateTemplateById -> updatedTemplate : %s ", updatedTemplate);

    templateResponse = { template: updatedTemplate };
    return templateResponse;
  } catch (e) {
    clogger.log("error", "service -> updateTemplateById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : delete Template By Id
  * @param id
  * @returns
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.deleteTemplateById = async (id) => {
  try {
    clogger.log("info", "service -> deleteTemplateById -> id : %s", id);
    return await deleteTemplateById(id)
  } catch (e) {
    clogger.log("error", "service -> deleteTemplateById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}



/**
  * @author RAKSHITH S R
  * @description service : UI Specific : getTemplateForRightPanelById
  * @param sourceId
  * @returns sourceResponse : source
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
 exports.getTemplateForRightPanelById = async (templateId) => {
  try {

    let templateResponse;
    let template;
    clogger.log("info", "service -> getTemplateForRightPanelById -> templateId : %s", templateId);
    template = await getTemplateForRightPanelById(templateId);
    clogger.log("info", "service -> getTemplateForRightPanelById -> template : %s ", template);
    templateResponse = { template: template };
    return templateResponse;
  } catch (e) {
    clogger.log("error", "service -> getTemplateForRightPanelById ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}




