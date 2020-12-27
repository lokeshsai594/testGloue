//common
const common = require('./common-controller');


//commune   
const template = require('./template-controller');
const source = require('./source-controller');
const sourcemapping = require('./sourcemapping-controller');

//rtbuilder
const action = require('./action-controller');
const rule = require('./rule-controller');
const flow = require('./flow-contoller');


//xbuilder
const widget = require('./widget-controller');
const dashboard = require('./dashboard-controller');


//common exports
exports.common = common;

//commune exports
exports.template = template;
exports.source = source;
exports.sourcemapping = sourcemapping;

//rtbuilder exports
exports.action = action;
exports.rule = rule;
exports.flow = flow;

//xbuilder exports
exports.widget = widget;
exports.dashboard = dashboard;