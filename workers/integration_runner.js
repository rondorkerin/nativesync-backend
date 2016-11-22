require('use-strict')
const async = require('asyncawait/async')
const await = require('asyncawait/await')
const Models = require('../models');
const IntegrationRunner = require('../services/integration_runner');
const scheduler = require('node-schedule');

module.exports = async(function() {
  console.log('integration runner worker is running');
  let integrationInstances = await(Models['IntegrationInstance'].findAll())
  for (let integrationInstance of integrationInstances) {
    let integration = await(integrationInstance.getIntegration());
    console.log('scheduling integration', integration.title, 'instance id', integrationInstance.id)
    if (integrationInstance.scheduling_info['type'] == 'cron') {
      scheduler.scheduleJob(integrationInstance.scheduling_info['value'], () => {
        console.log('running integration instance', integrationInstance.id);
        let runner = new IntegrationRunner(integration, integrationInstance)
        let output = await(runner.run());
        console.log('integration instance', integrationInstance.id, 'output', output);
      })
    }
  }
});
