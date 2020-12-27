const { getAllRules, getAllRulesWithPagination, getRuleById, getRuleWithScriptById, createRule, updateRuleById, deleteRuleById, getNextSequence, getCollectionCount, createScript, isScriptExists, getRuleForRightPanelById, getRuleWithScriptForRightPanelById, getFilteredRules } = require('../repositories')

const winston = require('winston');
const rtlogger = winston.loggers.get('rtlogger');


/**
  * @author RAKSHITH S R
  * @description service : create Rule
  * @param ruleRequest
  * @returns ruleResponse : createdRule
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.createRule = async (ruleRequest) => {
  try {

    rtlogger.log("info", "service -> createRule -> ruleRequest : %s", ruleRequest);


    let ruleResponse;
    let createdRule;

    let sequence = await getNextSequence("counters", "ruleId");
    rtlogger.log("info", "service -> createRule -> sequence : %s", sequence);

    ruleRequest.ruleId = "RU_" + sequence;
    ruleRequest.createdOn = new Date().toUTCString();

    let ruleType = ruleRequest.type;

    if (ruleType !== 'undefined' && ruleType === 'script') {
      // save script then rule
      rtlogger.log("info", "service -> createRule -> createScript starts-> ruleType : %s", ruleType);
      let script = ruleRequest.script;
      let scriptForView = ruleRequest.scriptForView;

      let scriptRequest = {
        'scriptId': "SC_" + sequence,
        'script': script,
        'scriptForView': scriptForView
      }

      let createdScript = await createScript(scriptRequest);
      rtlogger.log("info", "service -> createRule -> createdScript : %s", createdScript);

      rtlogger.log("info", "service -> createRule -> createScript ends-> ruleType : %s", ruleType);

      delete ruleRequest['scriptForView'];
      ruleRequest.script = createdScript.scriptId;
    }

    rtlogger.log("info", "service -> createRule -> ruleRequest : %s", ruleRequest);
    createdRule = await createRule(ruleRequest);
    ruleResponse = { rule: createdRule };
    return ruleResponse;

  } catch (e) {
    rtlogger.log("error", "service -> createRule ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get All Rules
  * @returns ruleResponse : rules
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getAllRules = async () => {
  try {

    let rules;
    let ruleResponse;

    rules = await getAllRules();
    rtlogger.log("info", "service -> getAllRules -> rules : %s ", rules);

    ruleResponse = { rules: rules };
    return ruleResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getAllRules ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : getAll Rules With Pagination
  * @param pageNumber
  * @param pageSize
  * @returns ruleResponse : rules
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getAllRulesWithPagination = async (pageNumber, pageSize) => {
  try {


    let ruleResponse;
    let totalCount;
    let rules;
    let totalPages;

    let skipValue = pageSize * (pageNumber - 1);
    let limitValue = pageSize;

    rtlogger.log("info", "service -> getAllRulesWithPagination -> skipValue : %s and limitValue : %s", skipValue, limitValue);
    rules = await getAllRulesWithPagination(skipValue, limitValue);

    totalCount = await getCollectionCount("rules");
    totalPages = Math.ceil(totalCount / pageSize);
    ruleResponse = { rules: rules, totalPages: totalPages };

    rtlogger.log("info", "service -> getAllRulesWithPagination -> totalCount : %s and totalPages : %s", totalCount, totalPages);
    return ruleResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getAllRulesWithPagination ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : get Rule By Id
  * @param ruleId
  * @returns ruleResponse : rule
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getRuleById = async (ruleId) => {
  try {

    let ruleResponse;
    let rule;
    rtlogger.log("info", "service -> getRuleById -> sourceId : %s", ruleId);
    rule = await getRuleById(ruleId);
    rtlogger.log("info", "service -> getRuleById -> rule : %s", JSON.stringify(rule));
    ruleResponse = { rule: rule };
    return ruleResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getRuleById -> error ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : getRule With Script By Id
  * @param ruleId
  * @returns ruleResponse : rule
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getRuleWithScriptById = async (ruleId) => {
  try {

    let ruleResponse;
    let rule;
    let isScriptWithRule = await isScriptExists(ruleId);

    if (isScriptWithRule) {
      rtlogger.log("info", "service -> getRuleWithScriptById -> ruleId : %s", isScriptWithRule);
      rule = await getRuleWithScriptById(ruleId);
    } else {
      rtlogger.log("info", "service -> getRuleWithScriptById -> ruleId : %s", isScriptWithRule);
      rule = await getRuleById(ruleId);
    }

    rtlogger.log("info", "service -> getRuleWithScriptById -> rule : %s", JSON.stringify(rule));
    ruleResponse = { rule: rule };
    return ruleResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getRuleWithScriptById -> error ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : update Rule By Id
  * @param id
  * @param ruleRequest
  * @returns ruleResponse : updatedRule
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.updateRuleById = async (id, ruleRequest) => {
  try {

    let ruleResponse;
    let updatedRule;
    rtlogger.log("info", "service -> updateRuleById -> ruleRequest : %s", ruleRequest);

    ruleRequest.modifiedOn = new Date();
    updatedRule = await updateRuleById(id, ruleRequest);
    rtlogger.log("info", "service -> updateRuleById -> updatedRule : %s", updatedRule);
    ruleResponse = { rule: updatedRule };
    return ruleResponse;
  } catch (e) {
    rtlogger.log("error", "service -> updateRuleById -> error:  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}

/**
  * @author RAKSHITH S R
  * @description service : delete Rule By Id
  * @param id
  * @returns ruleResponse : updatedRule
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.deleteRuleById = async (id) => {
  try {
    rtlogger.log("info", "service -> deleteRuleById -> id : %s", id);
    return await deleteRuleById(id)
  } catch (e) {
    rtlogger.log("error", "service -> deleteRuleById -> error :  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}




/**
  * @author RAKSHITH S R
  * @description service : get Rule For Right Panel By Id
  * @param ruleId
  * @returns ruleResponse : rule for right panel
  * @Date 20-04-2020
  * @ModifiedOn 20-04-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getRuleForRightPanelById = async (ruleId) => {
  try {

    let ruleResponse;
    let rule;

    let isScriptWithRule = await isScriptExists(ruleId);
    rtlogger.log("info", "service -> getRuleForRightPanelById -> isScriptWithRule -> isScriptWithRule : %s", isScriptWithRule);
    if (!isScriptWithRule) {
      rtlogger.log("info", "service -> getRuleForRightPanelById -> ruleId : %s", ruleId);
      rule = await getRuleForRightPanelById(ruleId);
      rtlogger.log("info", "service -> getRuleForRightPanelById -> rule : %s", JSON.stringify(rule));
    } else {
      rtlogger.log("info", "service -> getRuleForRightPanelById -> ruleId : %s", ruleId);
      rule = await getRuleWithScriptForRightPanelById(ruleId);
      rtlogger.log("info", "service -> getRuleForRightPanelById -> rule : %s", JSON.stringify(rule));
    }



    ruleResponse = { rule: rule };
    return ruleResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getRuleForRightPanelById -> error ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}





/**
  * @author RAKSHITH S R
  * @description service : get Filtered Rules
  * @param ruleId
  * @returns ruleResponse : rule
  * @Date 20-05-2020
  * @ModifiedOn 20-05-2020
  * @ModifiedBy RAKSHITH S R
  */
exports.getFilteredRules = async (sourceId, topicOrUri, status, filterValue) => {
  try {

    let ruleResponse;
    let rule;
    let templateBased;
      rtlogger.log("info", "service -> getRuleById -> sourceId : %s and topicOrUri : %s and status : %s and templateBased : %s ", sourceId, topicOrUri, status, templateBased);

    if (filterValue === "WITH_TEMP") {
      templateBased = true;
    } else if (filterValue === "WITHOUT_TEMP") {
      templateBased = false;
    } else if (filterValue === "ALL") {
      templateBased = "ALL";
    }else{
      templateBased = "ALL";
    }

    rule = await getFilteredRules(sourceId, topicOrUri, status, templateBased);
    rtlogger.log("info", "service -> getRuleById -> rule : %s", JSON.stringify(rule));
    ruleResponse = { rule: rule };
    return ruleResponse;
  } catch (e) {
    rtlogger.log("error", "service -> getRuleById -> error ->  %s", JSON.stringify(e.message));
    throw new Error(e.message)
  }
}


