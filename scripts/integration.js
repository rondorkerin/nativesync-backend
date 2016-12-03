require('use-strict')
var Models = require('../models');

Models['Client'].upsert({partner_id: 1, name: 'test', api_key: 'abc', url: 'nativesync.io'})
Models['Partner'].upsert({name: 'test'})
Models['Integration'].upsert({
  partner_id: 1,
  creator_user_id: 1,
  title: 'A test script',
  version: '1.0',
  type: 'hosted_mvp',
  language: 'javascript',
  scheduling_info: {
    type: 'cron',
    value: '0 * * * * *',
  },
  internal_name: 'ip_api_test',
  documentation: "TODO: Readme",
  privacy: 'private',
  pricing: {
    upfront: 0,
    monthly: 100.0,
    buyout: 10000.0,
  },
  onboarding: {
    type: 'self_serve',
    fields: []
  },
  required_service_auth_ids: [
    1
  ],
  referrals: [
    {
      partner_id: 1,
      code: 'SHARPSPRING',
      upfront_split: 0.2,
      monthly_split: 0.2,
      buyout_split: 0.2
    }
  ]
})
.then(function(x) {
  return Models['Integration'].findOne({where: {
    title: 'A test script',
  }})
.then(function(integration) {
  console.log('found integration', integration.id)
  return Models['IntegrationInstance'].upsert({
    integration_id: integration.id,
    client_id: 1,
    scheduling_info: {
      type: 'cron',
      value: '0 * * * * *',
    },
    internal_name: 'lookup_ip',
    active: true,
    inputs: {
      hello: 'world'
    },
    last_run: null
  }).then(function() {
    return Models['IntegrationInstance'].findOne({where: {
      integration_id: integration.id
    }})
  }).then(function(integrationInstance) {
    Models['IntegrationCode'].upsert({
      integration_instance_id: integrationInstance.id,
      code: "log('hello world'); ns('IP-API', 'IP Location Lookup', {ip: '73.229.150.226'}).then(function(result) { set('ip_result', result) }).then(end);"
    })
  })
})
