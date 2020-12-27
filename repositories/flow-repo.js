var mongoDB = require('../utils/mongo-connector');
const { ObjectId } = require('mongodb');

const winston = require('winston');
const rtlogger = winston.loggers.get('rtlogger');

/**
 * @author Rakshith S R
 * @description repo :get All Flows
 * @returns flows
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.getAllFlows = async () => {

  var conn = mongoDB.getconnection();

  let flows = await conn.collection('flows').find({}).toArray();
  console.log("flows", JSON.stringify(flows));
  return flows;
}



/**
 * @author Rakshith S R
 * @description repo : get Flow By Id
 * @param flowId
 * @returns flow
 * @Date 07-08-2020
 * @ModifiedOn 07-08-2020
 * @ModifiedBy Rakshith S R
 */
exports.getFlowById = async (flowId) => {
  var conn = mongoDB.getconnection();
  let flow = await conn.collection('flows').findOne({ flowId: flowId });
  rtlogger.log("info", "getTemplateById -> flow : %s", JSON.stringify(flow));
  return flow;
}

/**
 * @author Rakshith S R
 * @description repo :create Flow
 * @param flowRequest
 * @returns flow
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.createFlow = async (flowRequest) => {

  let flowResponse = {};
  var conn = mongoDB.getconnection();
  let flowResponseObj = await conn.collection('flows').insertOne(flowRequest);
  flowResponse = flowResponseObj.ops[0];
  rtlogger.log("info", "repo -> createflow -> flowResponse : %s", JSON.stringify(flowResponse));
  return flowResponse;

}


/**
 * @author Rakshith S R
 * @description repo :update Flow By Id
 * @param id
 * @param flowRequest
 * @returns flow
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.updateFlowById = async (id, flowRequest) => {
  var conn = mongoDB.getconnection();
  return conn.collection('flows').updateOne({ flowId: id }, { $set: flowRequest });

}


/**
 * @author Rakshith S R
 * @description repo :delete Flow By Id
 * @param id
 * @returns flow
 * @Date 20-04-2020
 * @ModifiedOn 20-04-2020
 * @ModifiedBy Rakshith S R
 */
exports.deleteFlowById = async (id) => {
  var conn = mongoDB.getconnection();
  return conn.collection('flows').deleteOne({ flowId: id });

}

exports.getFlowForRightPanelById = async (flowId) => {

  rtlogger.log("info", "repo -> getFlowForRightPanelById -> flowId :%s", flowId);

  var conn = mongoDB.getconnection();

  let matchObj = { "$match": { "flowId": flowId } };

  let projectObj = {
    "$project": {
      "section_1.name": "$name",
      "section_1.description": "$description",
      "section_2": { "section_2": "$section_2" },
      "section_3": { "section_3": "$section_3" },
      "section_4.createdBy": "$createdBy",
      "section_4.createdOn": "$createdOn",
      "section_4.modifiedBy": "$modifiedBy",
      "section_4.modifiedOn": "$modifiedOn",
      "section_5.sources": {
        "$map": {
          "input": { "$objectToArray": "$nodes.Source" },
          "in": {
            //"store_code":"$$this.k", 
            "sourceId": "$$this.v.sourceId",
            "nodeName": "$$this.v.name"
          }
        }
      },
      "section_5.rules": {
        "$map": {
          "input": { "$objectToArray": "$nodes.Rules" },
          "in": {
            //"store_code":"$$this.k", 
            "rulesId": "$$this.v.ruleId",
            "nodeName": "$$this.v.nodeName"
          }
        }
      },
      "section_5.actions": {
        "$map": {
          "input": { "$objectToArray": "$nodes.Actions" },
          "in": {
            //"store_code":"$$this.k", 
            "actionId": "$$this.v.actionId",
            "nodeName": "$$this.v.nodeName"
          }
        }
      },
      "section_5.forwarders": {
        "$map": {
          "input": { "$objectToArray": "$nodes.Forwarders" },
          "in": {
            //"store_code":"$$this.k", 
            "forwarderId": "$$this.v.forwarderId",
            "nodeName": "$$this.v.nodeName"
          }
        }
      },
      "section_5.triggers": {
        "$map": {
          "input": { "$objectToArray": "$nodes.Triggers" },
          "in": {
            //"store_code":"$$this.k", 
            "triggerId": "$$this.v.triggerId",
            "nodeName": "$$this.v.nodeName"
          }
        }
      },
      "section_5.vnodes": {
        "$map": {
          "input": { "$objectToArray": "$nodes.Vnodes" },
          "in": {
            //"store_code":"$$this.k", 
            "vnodeId": "$$this.v.vNodeId",
            "nodeName": "$$this.v.nodeName"
          }
        }
      }
    }
  };


  let flowResponse = await conn.collection('flows').aggregate([matchObj, projectObj]).toArray();
  rtlogger.log("info", "repo -> createflow -> flowResponse : %s", JSON.stringify(flowResponse));
  let flowresponse = flowResponse[0];
  return flowresponse;

}



exports.getFlowStatus = async (flowId) => {

  var conn = mongoDB.getconnection();

  let matchObj = { "$match": { "flowId": flowId } };

  let probjectobj = {
    "$project": {
      "_id": 0,
      "flows": {
        "$map": {
          "input": { "$objectToArray": "$nodes.Source" },
          "in": {
            "flowId": "$flowId",
            "sourceId": "$$this.v.sourceId",
            "uriOrTopic": "$$this.v.uriOrTopic",
            "sourceMappingId": "$$this.v.sourceMappingId",
            "uniqueResourceSelectedStatus": "$$this.v.uniqueResourceSelectedStatus",
            "name": "$$this.v.name",
            "url": "$$this.v.url",
            "protocol": "$$this.v.protocol",
            "uniqueResourceSelected": "$$this.v.uniqueResourceSelected",
            "methodOrType": "$$this.v.methodOrType"
          }
        }
      }
    }
  }

  let unwind = {
    "$unwind": "$flows"
  }

  let flowresponse = await conn.collection('flows').aggregate([matchObj, probjectobj, unwind]).toArray();
  rtlogger.log("info", "repo -> getFlowStatus -> flowresponse : %s", JSON.stringify(flowresponse));
  let flowResponse = flowresponse[0];
  //console.log(flowResponse);
  rtlogger.log("info", "repo -> getFlowStatus -> flowResponse : %s", JSON.stringify(flowResponse));
  return flowResponse.flows;
}





exports.setStatusFlowId = async (flowId, status, comment) => {

  let updateData;

  rtlogger.log("info", "repo -> setStatusFlowId -> flowId : %s and status: %s and comment: %s ", flowId, status, comment);
  var conn = mongoDB.getconnection();

  let modifiedOn = new Date().toUTCString();
  let defaultUser = "Ajay Ramesh";  //Need to replace in future

  if (status == 'Approve') {
    updateData = await conn.collection('flows').updateOne({ flowId: flowId }, { $set: { "status": 'Approved', "statusUpdateComment": comment, "modifiedBy": defaultUser, "modifiedOn": modifiedOn } });
  } else {
    updateData = await conn.collection('flows').updateOne({ flowId: flowId }, { $set: { "status": 'Disapproved', "statusUpdateComment": comment, "modifiedBy": defaultUser, "modifiedOn": modifiedOn } });
  }

  let matchObj = { "$match": { "flowId": flowId } };
  let projectobj = {
    "$project": {
      "_id": 0,
      "flowId": 1,
      "status": 1
    }
  }

  let flowresponse = await conn.collection('flows').aggregate([matchObj, projectobj]).toArray();
  rtlogger.log("info", "repo -> setStatusFlowId -> flowresponse : %s", JSON.stringify(flowresponse));
  let flowResponse = flowresponse[0];
  rtlogger.log("info", "repo -> setStatusFlowId -> flowResponse : %s", JSON.stringify(flowResponse));
  console.log(flowResponse);
  return flowResponse;
}



exports.getFlowWithVnodeDetails = async (flowId) => {
  var conn = mongoDB.getconnection();


  let matchObjForFlow = { "$match": { "flowId": flowId } };
  let lookupObjForSource = { "$lookup": { "localField": "nodes.Source.Source_0.sourceId", "from": "sources", "foreignField": "sourceId", "as": "sourceForFlow" } };
  let unwindObjForSource = { "$unwind": "$sourceForFlow" };
  let projectObj = {
    "$project": {
      "_id":0,
      "flowId":1,
      "name": 1,
      "sourceId": "$sourceForFlow.sourceId",
      "templateId": "$sourceForFlow.templateId",
      "uriOrTopic": "$nodes.Source.Source_0.uriOrTopic",
      "sourceMappingReqd": "$sourceForFlow.sourceMappingReqd",
      "Vnodes": "$nodes.Vnodes",
      "isVnode": 1,
      "isVnodeLinked": 1
    }
  }

  let flowWithSourceDetailsArr = await conn.collection('flows').aggregate([matchObjForFlow, lookupObjForSource, unwindObjForSource, projectObj]).toArray();
  let flowWithSourceDetails = flowWithSourceDetailsArr[0];
  rtlogger.log("info", "repo -> getFlowWithVnodeDetails -> flowWithSourceDetails : %s", JSON.stringify(flowWithSourceDetails));


  let uriOrTopicForSource = flowWithSourceDetails.uriOrTopic;
  let sourceId = flowWithSourceDetails.sourceId;
  let sourceMappingReqd = flowWithSourceDetails.sourceMappingReqd;

  rtlogger.log("info", "repo -> getFlowWithVnodeDetails -> uriOrTopicForSource : %s and sourceId : %s",uriOrTopicForSource,sourceId);

  let matchObjForSource = { "$match": { "sourceId": sourceId } };
  let lookupForSM = { "$lookup": { "localField": "sourceId", "from": "sourcemappings", "foreignField": "sourceId", "as": "smForFlow" } };
  
  let projectForPayloadSM = {
    "$project":
    {
      "name": 1,
      "resourceDetails": 1,
     "smForFlow": 1,
      "resourceDetailsFiltered": {
        "$map": {
          "input": {
            "$filter": {
              "input": "$resourceDetails",
              "as": "resource",
              "cond": { "$eq": ["$$resource.uriOrTopic", uriOrTopicForSource] }
            }
          },
          "as": "resourceFiltered",
          "in": {
            "name": "$$resourceFiltered.name",
            "resourceId": "$$resourceFiltered.id",
            "payload": "$$resourceFiltered.responsePayload.payload",
            }
        }
      }
    }
  };

  let unwindResource = { "$unwind": "$resourceDetailsFiltered" };
  let unwindSM = { "$unwind": "$smForFlow" };
  let projectUnwinded = {
    "$project":
    {
     "resourceId": "$resourceDetailsFiltered.resourceId",
      "resPayload": "$resourceDetailsFiltered.payload",
      "firstMappingDetails": { "$arrayElemAt": ["$smForFlow.mappingDetails", 0] }
    }
  };

  let projectFinal = {
    "$project":
    {
      "resourceId": 1,
      "resPayload": 1,
      "metadataPayload": "$firstMappingDetails.metaInfo"
    }
  }



  
  /** Below code is used if source not having any source mappings */
  
  let projectForPayloadwithoutSM = {
    "$project":
    {
      "name": 1,
      "resourceDetails": 1,
      "resourceDetailsFiltered": {
        "$map": {
          "input": {
            "$filter": {
              "input": "$resourceDetails",
              "as": "resource",
              "cond": { "$eq": ["$$resource.uriOrTopic", uriOrTopicForSource] }
            }
          },
          "as": "resourceFiltered",
          "in": {
            "name": "$$resourceFiltered.name",
            "resourceId": "$$resourceFiltered.id",
            "payload": "$$resourceFiltered.responsePayload.payload",
            }
        }
      }
    }
  };


  let projectUnwindedWithoutSM = {
    "$project":
    {
      "resourceId": "$resourceDetailsFiltered.resourceId",
      "resPayload": "$resourceDetailsFiltered.payload"
      
     
    }
  };


  let sourceWithMappingDetailsArr;

   if(!sourceMappingReqd){
    sourceWithMappingDetailsArr = await conn.collection('sources').aggregate([matchObjForSource, lookupForSM, projectForPayloadwithoutSM, unwindResource, projectUnwindedWithoutSM]).toArray();
   }else{
    sourceWithMappingDetailsArr = await conn.collection('sources').aggregate([matchObjForSource, lookupForSM, projectForPayloadSM, unwindResource, unwindSM, projectUnwinded, projectFinal]).toArray();
   }
   

  let sourceWithMappingDetails = sourceWithMappingDetailsArr[0];
  rtlogger.log("info", "repo -> getFlowWithVnodeDetails -> sourceWithMappingDetails : %s", JSON.stringify(sourceWithMappingDetails));


  const flowWithVNodeDetails = { ...flowWithSourceDetails, ...sourceWithMappingDetails }
  return flowWithVNodeDetails;

}



exports.updateVNodeLinkFlag = async (flowId, isVnodeLinked) => {

  let updateData;

  const query = { flowId: flowId };
  const updateRequest = { $set: { "isVnodeLinked": isVnodeLinked }};
  const options = { returnNewDocument: true };

  rtlogger.log("info", "repo -> updateVNodeLinkFlag -> flowId : %s and isVnodeLinked: %s ", flowId, isVnodeLinked);
  var conn = mongoDB.getconnection();
  updateData = await conn.collection('flows').findOneAndUpdate(query, updateRequest,options );
  rtlogger.log("info", "repo -> updateVNodeLinkFlag -> updateData : %s", JSON.stringify(updateData));
  
  let flowUpdated = updateData.value;
  console.log(flowUpdated);
  return flowUpdated;
}