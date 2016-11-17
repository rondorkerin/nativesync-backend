"use strict"
var async = require('async')
var await = require('await')

nexternal = await(Service.upsert({name: 'Nexternal'}))
Action.create({
  service_id: nexternal.id,
  schemes: ['https'],
  headers: [{'Content Type': 'application/x-www-form-urlencoded'}],
  host: 'nexternal.com',
  path: '',
  method: 'POST',
  creator_user_id: 1,
  service_name: nexternal.name,
  function_name: 'getRecentOrders',
  type: 'rest',
  input_content_type: 'xml',
  output_content_type: 'xml',
  version: '1',
  description: 'a test action',
  input: [],
  output: [],
  official: true
})

Action.create({
  service_id: nexternal.id,
  schemes: ['https'],
  headers: [{'Content Type': 'application/x-www-form-urlencoded'}],
  host: 'nexternal.com',
  path: '/shared/xml/testsubmit.rest',
  method: 'POST',
  creator_user_id: 1,
  service_name: nexternal.name,
  function_name: 'test submit request',
  type: 'rest',
  input_content_type: 'xml',
  output_content_type: 'xml',
  version: '1',
  description: 'Nexternal requires you to submit a test submit request before anything else',
  input: [],
  output: [],
  official: true
})
/*
 *
**		Credentials
**		Credentials/AccountName
**		Credentials/UserName
**		Credentials/Password
 */

Action.create({
  service_id: nexternal.id,
  schemes: ['https'],
  headers: [{'Content Type': 'application/x-www-form-urlencoded'}],
  host: 'nexternal.com',
  path: '/shared/xml/testverify.rest',
  method: 'POST',
  creator_user_id: 1,
  service_name: nexternal.name,
  function_name: 'test verify',
  type: 'rest',
  input_content_type: 'xml',
  output_content_type: 'xml',
  version: '1',
  description: 'Nexternal requires you to submit a test submit request before anything else',
  input: [],
  output: [],
  official: true
})
