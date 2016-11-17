"use strict"
var async = require('asyncawait/async')
var await = require('asyncawait/await')
var Service = require('../../models/service')
var Action = require('../../models/action')

var x = async(() => {
  var result = await(Service.upsert({name: 'IP-API'}))
  var ip_api = await(Service.findOne({where: {name: 'IP-API'}}))
  Action.upsert({
    service_id: ip_api.id,
    schemes: ['http'],
    headers: {'Content-Type': 'application/json'},
    query: [],
    host: 'ip-api.com',
    path: '/json/{ip}',
    method: 'GET',
    creator_user_id: 1,
    service_name: ip_api.name,
    function_name: 'IP Location Lookup',
    type: 'rest',
    input_content_type: 'json',
    output_content_type: 'json',
    version: '1',
    description: 'Look up a users location by IP',
    input: [{name: 'ip', in: 'path', description: 'IP address to lookup', required: true, type: 'string'}],
    output: [],
    input_example: [],
    output_example: {
      "status": "success",
      "country": "United States",
      "countryCode": "US",
      "region": "CA",
      "regionName": "California",
      "city": "San Francisco",
      "zip": "94105",
      "lat": "37.7898",
      "lon": "-122.3942",
      "timezone": "America\/Los_Angeles",
      "isp": "Wikimedia Foundation",
      "org": "Wikimedia Foundation"
    },
    official: false
  })
})

x();
