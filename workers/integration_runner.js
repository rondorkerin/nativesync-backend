require('use-strict')
const async = require('asyncawait/async')
const await = require('asyncawait/await')
const Models = require('../models');
const IntegrationRunner = require('../services/integration_runner');
const scheduler = require('node-schedule');

module.exports = async(function() {
  console.log('integration runner worker is running');
  let integrationInstances = await(Models['IntegrationInstance'].findAll({where: {active: true}}))
  for (let integrationInstance of integrationInstances) {
    let integration = await(integrationInstance.getIntegration());
    debugger;
    let integrationCode = await(Models['IntegrationCode'].findOne({where: {integration_id: integration.id}}))
    let client = await(integrationInstance.getClient());
    console.log('scheduling integration', integration.title, 'instance id', integrationInstance.id)
    if (integrationInstance.scheduling_info['type'] == 'cron') {
      scheduler.scheduleJob(integrationInstance.scheduling_info['value'], async(() => {
        console.log('running integration instance', integrationInstance.id);
        let runner = new IntegrationRunner(client, integration, integrationInstance)
        let output = await(runner.run());
        console.log('integration instance', integrationInstance.id, 'output', output);
      }))
    }
  }
});
