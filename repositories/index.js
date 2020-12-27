//commune repo imports
const { getAllTemplates, createTemplate, updateTemplateById, deleteTemplateById, getTemplateById, getAllTemplatesWithPagination,getTemplateForRightPanelById } = require('./template-repo');
const { getAllSources, getAllSourcesWithPagination, getSourceById, getAllFilteredSources, getSourceWithTemplate, getSourceWithoutTemplate, createSource, updateSourceById, deleteSourceById,getFilteredSources,getFilteredPostSources, getFilteredGetSources, getFilteredAllresources, getSourceWithObjPayload,getSourceForRightPanelById,getAllMappedSourcesWithOnlyTemp} = require('./source-repo');
const { getAllSourceMappings, getAllSourceMapWithPagination, getSourceMappingById, createSourceMapping, updateSourceMappingById, deleteSourceMappingById, getSourceMappingsForSourceId, getSourceMappingWithSource,getSourceMapForRightPanelById, getUniqueFieldDetails} = require('./sourcemapping-repo');

//rtbuilder repo imports
const { getAllActions, getActionById,createAction, updateActionById, deleteActionById,getAllActionsWithPagination,getActionForRightPanelById,getFilteredActions,actiondetailswithtype} = require('./action-repo');
const { getAllRules, getAllRulesWithPagination, getRuleById,getRuleWithScriptById, createRule, updateRuleById, deleteRuleById,isScriptExists ,getRuleForRightPanelById,getRuleWithScriptForRightPanelById,getFilteredRules} = require('./rule-repo');
const { getAllFlows, createFlow, updateFlowById, deleteFlowById, getFlowForRightPanelById, getFlowStatus, setStatusFlowId,getFlowById,getFlowWithVnodeDetails,updateVNodeLinkFlag } = require('./flow-repo');
const { getAllScripts,getScriptById,createScript,updateScriptById,deleteScriptById} = require('./script-repo');

//common repo
const { getCollectionCount, formatTypeCheck, getNextSequence, docsPerMatchingFieldValue,uriForUrlCheck,topicForUrlCheck,uniqueIdForSourceCheck,resourceNameForUrlCheck,tempIdForUrlCheck, getManageRecords, getManagePageRecords } = require('./common-repo');


//X-Builder repo imports
const { createWidget, getWidgetById, deleteWidgetById, getWidgetbyrightpanelId } = require('./widget-repo');
const { createDashboard , getDashboardById, latestMockData, getDashboardbyrightpanelId} = require('./dashboard-repo');


//template related repo's
exports.getAllTemplates = getAllTemplates;
exports.getAllTemplatesWithPagination = getAllTemplatesWithPagination;
exports.createTemplate = createTemplate;
exports.getTemplateById = getTemplateById;
exports.updateTemplateById = updateTemplateById;
exports.deleteTemplateById = deleteTemplateById;
exports.getTemplateForRightPanelById = getTemplateForRightPanelById;

//source related repo's
exports.getAllSources = getAllSources;
exports.getSourceById = getSourceById;
exports.getAllSourcesWithPagination = getAllSourcesWithPagination;
exports.createSource = createSource;
exports.updateSourceById = updateSourceById;
exports.deleteSourceById = deleteSourceById;
exports.getAllFilteredSources = getAllFilteredSources;
exports.getSourceWithTemplate = getSourceWithTemplate;
exports.getSourceWithoutTemplate = getSourceWithoutTemplate;
exports.getFilteredSources = getFilteredSources;
exports.getFilteredPostSources = getFilteredPostSources;
exports.getSourceWithObjPayload = getSourceWithObjPayload;
exports.getSourceForRightPanelById = getSourceForRightPanelById;
exports.getAllMappedSourcesWithOnlyTemp = getAllMappedSourcesWithOnlyTemp;

exports.getFilteredGetSources = getFilteredGetSources;
exports.getFilteredAllresources = getFilteredAllresources;

//source mapping related repo's
exports.getAllSourceMappings = getAllSourceMappings;
exports.getAllSourceMapWithPagination = getAllSourceMapWithPagination;
exports.getSourceMappingById = getSourceMappingById;
exports.createSourceMapping = createSourceMapping;
exports.updateSourceMappingById = updateSourceMappingById;
exports.deleteSourceMappingById = deleteSourceMappingById;
exports.getSourceMappingsForSourceId = getSourceMappingsForSourceId;
exports.getSourceMappingWithSource = getSourceMappingWithSource;
exports.getSourceMapForRightPanelById = getSourceMapForRightPanelById;
exports.getUniqueFieldDetails = getUniqueFieldDetails;



//rule related repo's
exports.getAllRules = getAllRules;
exports.createRule = createRule;
exports.updateRuleById = updateRuleById;
exports.deleteRuleById = deleteRuleById;
exports.getAllRulesWithPagination = getAllRulesWithPagination;
exports.getRuleById = getRuleById;
exports.getRuleWithScriptById = getRuleWithScriptById;
exports.isScriptExists = isScriptExists;
exports.getRuleForRightPanelById = getRuleForRightPanelById;
exports.getRuleWithScriptForRightPanelById = getRuleWithScriptForRightPanelById;
exports.getFilteredRules = getFilteredRules;

//action related repo's
exports.getAllActions = getAllActions;
exports.createAction = createAction;
exports.updateActionById = updateActionById;
exports.deleteActionById = deleteActionById;
exports.getAllActionsWithPagination = getAllActionsWithPagination;
exports.getActionById = getActionById;
exports.getActionForRightPanelById = getActionForRightPanelById;
exports.getFilteredActions = getFilteredActions;

exports.actiondetailswithtype = actiondetailswithtype;   //actiondetailswithtype

//flow related repo's
exports.getAllFlows = getAllFlows;
exports.createFlow = createFlow;
exports.updateFlowById = updateFlowById;
exports.deleteFlowById = deleteFlowById;
exports.getFlowForRightPanelById = getFlowForRightPanelById;  //getFlowForRightPanelById
exports.getFlowById = getFlowById;
exports.getFlowStatus = getFlowStatus;
exports.setStatusFlowId = setStatusFlowId;
exports.getFlowWithVnodeDetails = getFlowWithVnodeDetails;
exports.updateVNodeLinkFlag = updateVNodeLinkFlag;



//common repo's
exports.getCollectionCount = getCollectionCount;
exports.getNextSequence = getNextSequence;
exports.docsPerMatchingFieldValue = docsPerMatchingFieldValue;
exports.getManageRecords = getManageRecords;
exports.getManagePageRecords = getManagePageRecords;
exports.formatTypeCheck = formatTypeCheck;


exports.uriForUrlCheck = uriForUrlCheck;
exports.uniqueIdForSourceCheck = uniqueIdForSourceCheck;
exports.resourceNameForUrlCheck = resourceNameForUrlCheck;
exports.tempIdForUrlCheck = tempIdForUrlCheck;
exports.topicForUrlCheck = topicForUrlCheck;

//script repo's
exports.createScript = createScript;
exports.getScriptById = getScriptById;
exports.getAllScripts = getAllScripts;
exports.updateScriptById = updateScriptById;
exports.deleteScriptById = deleteScriptById;


//Widget repo's
exports.createWidget = createWidget;
exports.getWidgetById = getWidgetById;
exports.deleteWidgetById = deleteWidgetById;
exports.getWidgetbyrightpanelId = getWidgetbyrightpanelId;


//Dashboard repo's
exports.createDashboard = createDashboard;
exports.getDashboardById = getDashboardById;
exports.latestMockData = latestMockData;
exports.getDashboardbyrightpanelId = getDashboardbyrightpanelId;


