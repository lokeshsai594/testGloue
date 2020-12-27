const express = require('express')

const { action, rule, flow, template, source, sourcemapping, common, widget, dashboard } = require('../controllers');


const router = express.Router();


//common requests
router.post('/common/uniquecheck', common.uniqueCheck);
router.post('/common/uniqueValuesCheck', common.uniqueValuesCheck);
router.post('/common/getManageRecords',common.getManageRecords);
router.get('/common/formatType', common.formatType);

//commune template related --starts
router.post('/commune/templates', template.createTemplate);

router.get('/commune/templates', template.getAllTemplatesWithPagination);   //use template.getAllTemplates for without pagination
router.get('/commune/templates/:templateId', template.getTemplateById);
router.put('/commune/templates/:templateId', template.updateTemplateById);
router.delete('/commune/templates/:templateId', template.deleteTemplateById);
//commune template related --ends


//commune source related --starts
router.post('/commune/sources', source.createSource);

router.get('/commune/sources', source.getAllSourcesWithPagination); // use source.getAllSources without pagination
router.get('/commune/sources/:sourceId', source.getSourceById);
router.put('/commune/sources/:sourceId', source.updateSourceById);
router.delete('/commune/sources/:sourceId', source.deleteSourceById);
//commune source related -- ends


//commune common related --ends
router.get('/common/sources/filter', source.getFilteredSources);  //SM : 1 Find all souce name and source Id for Source requires Source mapping
router.get('/common/sources/:sourceId/templates', source.getSourceWithTemplate); //SM : 2 Find Template data + Unique Key based on SourceId
router.get('/common/sourcemappings/filter', sourcemapping.getFilteredSourceMappings); //Rule :2 Get source mapping name and ID details w.r.t source ID 
router.get('/common/sources/:sourceId/sourcemappings/:sourcemappingId', sourcemapping.getSourceMappingWithSource);//SM 3 Get source mapping and source details w.r.t source ID and soourceMapping ID
router.get('/common/sourcemappings/getUniqueDetails/:sourceId',sourcemapping.getUniqueFieldDetails);
//commune common related --ends

//rtbuilder common related --starts

router.post('/common/rules/filter', rule.getFilteredRules);
router.get('/common/actions/filter', action.getFilteredActions);    //integrated actiondetailwithapi with this URL


//rtbuilder common related --ends


//UI Specific services
router.get('/common/rightpanel/sources/:sourceId', source.getSourceForRightPanelById);
router.get('/common/rightpanel/templates/:templateId', template.getTemplateForRightPanelById);
router.get('/common/rightpanel/sourcemappings/:sourcemappingId', sourcemapping.getSourceMapForRightPanelById);
router.get('/common/rightpanel/rules/:ruleId', rule.getRuleForRightPanelById);
router.get('/common/rightpanel/actions/:actionId', action.getActionForRightPanelById);
router.get('/common/rightpanel/flows/:flowId',flow.getflowbyrightpanelId); //getflowbyrightpanelId API
router.get('/common/rightpanel/widgets/:widgetId',widget.getWidgetbyrightpanelId);
router.get('/common/rightpanel/dashboards/:dashboardId',dashboard.getDashboardbyrightpanelId);

//commune source mapping related --starts
router.post('/commune/sourcemappings', sourcemapping.createSourceMapping);
router.get('/commune/sourcemappings', sourcemapping.getAllSourceMapWithPagination); // use sourcemapping.getAllSourceMappings
router.get('/commune/sourcemappings/:sourcemappingId', sourcemapping.getSourceMappingById);
router.put('/commune/sourcemappings/:sourcemappingId', sourcemapping.updateSourceMappingById);
router.delete('/commune/sourcemappings/:sourcemappingId', sourcemapping.deleteSourceMappingById);
//commune source mapping related --ends

//RT Builder Rule Related -- starts 
router.post('/rtbuilder/rules', rule.createRule);
router.get('/rtbuilder/rules', rule.getAllRules);
router.get('/rtbuilder/rules/:ruleId', rule.getRuleById);
router.put('/rtbuilder/rules/:ruleId', rule.updateRuleById);
router.delete('/rtbuilder/rules/:ruleId', rule.deleteRuleById);
//RT Builder Rule Related -- ends 


//RT Builder Action Related -- starts 



router.post('/rtbuilder/actions', action.createAction);
router.get('/rtbuilder/actions', action.getAllActions);
router.get('/rtbuilder/actions/:actionId', action.getActionById);
router.put('/rtbuilder/actions/:actionId', action.updateActionById);
router.delete('/rtbuilder/actions/:actionId', action.deleteActionById);
//router.get('/rtbuilder/action/filter',action.getactiondetailswithtype);   //actiondetailwithtypeofaction


//RT Builder Action Related -- ends 


//RT Builder Flow Related -- starts 
router.post('/rtbuilder/flows', flow.createFlow);
router.get('/rtbuilder/flows', flow.getAllFlows);
router.get('/rtbuilder/flows/:flowId', flow.getFlowById);
//router.put('/rtbuilder/flows/:flowId', flow.updateFlowById);
router.delete('/rtbuilder/flows/:flowId', flow.deleteFlowById);

router.put('/rtbuilder/flows/action', flow.getFlowStatus);  

//RT Builder Flow Related -- ends 


//RTBuilder Common starts

router.get('/common/flows/filter', flow.getFilteredFlows);
router.post('/common/flows/source/link', flow.linkToCommune);
//RTBuilder Common ends




//X-Builder widget Related --starts

router.post('/xbuilder/widgets', widget.createWidget);
router.get('/xbuilder/widgets/:widgetId',widget.getWidgetById);
router.delete('/xbuilder/widget/:widgetId',widget.deleteWidgetById);



//X-Builder widget Related  --ends


//DashboardScreen Related - starts
router.post('/xbuilder/dashboards',dashboard.createDashboard);
router.get('/xbuilder/dashboards/:dashboardId',dashboard.getDashboardById);


router.post('/xbuilder/mockdata/latest',dashboard.latestMockData);
//DashboardScreen Related - ends

module.exports = router;
