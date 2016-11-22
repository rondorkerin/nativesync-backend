require('use-strict')
var Models = require('../models');

Models['Integration'].upsert({
  partner_id: 1,
  creator_user_id: 1,
  title: 'A test script',
  version: '1.0',
  type: 'hosted',
  language: 'javascript',
  scheduling_info: {
    type: 'cron',
    value: '* * * * * *',
  },
  code: "console.log('hello world')",
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

Models['IntegrationInstance'].upsert({
  integration_id: 1,
  client_id: 1,
  scheduling_info: {
    type: 'cron',
    value: '* * * * * *',
  },
  active: true,
  inputs: {
    hello: 'world'
  },
  last_run: null
})
