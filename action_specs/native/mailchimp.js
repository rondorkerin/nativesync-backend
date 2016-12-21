"use strict"
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var Service = require('../../models/service')
var Action = require('../../models/action')
var ActionServiceAuth = require('../../models/action_service_auth')
var ServiceAuth = require('../../models/service_auth')

var x = async(() => {
  var result = await(Service.upsert({name: 'Mailchimp'}))
  var mailchimp = await(Service.findOne({where: {name: 'Mailchimp'}}))
  await(Action.upsert({
    service_id: mailchimp.id,
    schemes: 'https',
    headers: {'Content-Type': 'application/json'},
    query: [],
    host: '{data-center}.api.mailchimp.com',
    path: '/3.0/lists',
    method: 'GET',
    creator_user_id: 1,
    service_name: mailchimp.name,
    function_name: 'get_lists',
    title: 'Get lists',
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
  }))


  var action = await(Action.findOne({where: {function_name: 'get_lists'}}))
  await(ServiceAuth.upsert({service_id: mailchimp.id, name: 'Basic Auth', type: 'basic', details: {username: 'string', password: 'string'}}))
  var serviceAuth = await(ServiceAuth.findOne({where: {service_id: mailchimp.id, name: 'Basic Auth'}}))
  await(ActionServiceAuth.upsert({action_id: action.id, service_auth_id: serviceAuth.id}))
  await(ServiceAuth.upsert({service_id: mailchimp.id, name: 'Datacenter', type: 'configuration', details: {'data-center': 'string'}}))
  serviceAuth = await(ServiceAuth.findOne({where: {service_id: mailchimp.id, name: 'Datacenter'}}))
  await(ActionServiceAuth.upsert({action_id: action.id, service_auth_id: serviceAuth.id}))

})

x();
