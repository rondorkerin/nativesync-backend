"use strict"
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var Service = require('../../models/service')
var Action = require('../../models/action')
var ActionServiceAuth = require('../../models/action_service_auth')
var ServiceAuth = require('../../models/service_auth')

var x = async(() => {
  var result = await(Service.upsert({name: 'Sharpspring'}))
  var sharpspring = await(Service.findOne({where: {name: 'Sharpspring'}}))


  var genericSSAction = {
    service_id: sharpspring.id,
    schemes: ['https'],
    headers: {'Content-Type': 'application/json'},
    query: [],
    host: 'api.sharpspring.com',
    path: '/v1',
    method: 'POST',
    creator_user_id: 1,
    service_name: sharpspring.name,
    function_name: 'get_leads',
    title: 'Get leads',
    type: 'rest',
    input_content_type: 'json',
    output_content_type: 'json',
    version: '1',
    description: 'Look up a users location by IP',
    input: [{name: 'data-center', in: 'host', description: 'Datacenter', required: true, type: 'string'}],
    output: [],
    input_example: [],
    output_example: {},
    official: false
  }
  var genericSSRequest = {
    type: 'object',
    properties: {
      method: {
        type: 'string',
      },
      id: {
        type: 'string',
      },
      params: {
        type: 'object',
      }
    }
  }

  var getLeads = Object.assign({}, genericSSAction);
  var getLeadsBody = Object.assign({}, genericSSRequest);
  getLeads['function_name'] = 'get_leads';
  getLeads['title'] = 'Get leads';
  getLeads['input'] = [{in: 'body', name: 'body', schema: getLeadsBody}];
  await(Action.upsert(getLeads))

  var createLeads = Object.assign({}, genericSSAction);
  var createLeadsBody = Object.assign({}, genericSSRequest);
  createLeadsBody['properties']['params'] = {
    type: 'object',
    properties: {
      objects: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            firstName: {
              type: 'string'
            },
            lastName: {
              type: 'string'
            },
            companyName: {
              type: 'string'
            },
            emailAddress: {
              type: 'string'
            },
          }
        }
      }
    }
  }
  createLeads['function_name'] = 'create_leads';
  createLeads['title'] = 'Create leads';
  createLeads['input'] = [{in: 'body', name: 'body', schema: createLeadsBody}];
  await(Action.upsert(createLeads))

  // create authentications required
  await(ServiceAuth.upsert({service_id: sharpspring.id, name: 'Account ID', type: 'apiKey', details: {name: 'accountID', in: 'query'}}))
  await(ServiceAuth.upsert({service_id: sharpspring.id, name: 'Secret Key', type: 'apiKey', details: {name: 'secretKey', in: 'query'}}))

  var accountIDAuth = await(ServiceAuth.findOne({where: {service_id: sharpspring.id, name: 'Account ID'}}))
  var secretKeyAuth = await(ServiceAuth.findOne({where: {service_id: sharpspring.id, name: 'Secret Key'}}))

  // add authentication to list of actions
  var actionNames = ['get_leads', 'create_leads'];
  for (var actionName of actionNames) {
    var action = await(Action.findOne({where: {function_name: actionName}}))
    debugger;
    await(ActionServiceAuth.upsert({action_id: action.id, service_auth_id: secretKeyAuth.id}))
    await(ActionServiceAuth.upsert({action_id: action.id, service_auth_id: accountIDAuth.id}))
  }
})

x().then(() => {console.log('done')});
