

//common
const commonService = require('./common-service');

//commune
const templateService = require('./template-service');
const sourceService = require('./source-service');
const sourceMappingService = require('./sourcemapping-service');

//rtbuilder
const ruleService = require('./rule-service');
const actionService = require('./action-service');
const flowService = require('./flow-service');

//X-Builder
const widgetService = require('./widget-service');
const dashboardService = require('./dashboard-service');


//common
exports.commonService = commonService;

//commune
exports.templateService = templateService;
exports.sourceService = sourceService;
exports.sourceMappingService = sourceMappingService;


//rtbuilder
exports.ruleService = ruleService;
exports.actionService = actionService;
exports.flowService = flowService;

//X-Builder
exports.widgetService = widgetService;
exports.dashboardService = dashboardService;


