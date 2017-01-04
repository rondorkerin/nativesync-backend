'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.removeColumn( 'integration', 'required_service_auth_ids'))
    await(queryInterface.removeColumn( 'integration_code', 'integration_instance_id'))
		await(queryInterface.addIndex('integration_code', ['integration_id'], {indicesType: 'UNIQUE'}));
    await(queryInterface.removeColumn( 'user', 'password'))
    await(queryInterface.removeColumn( 'organization_system_auth', 'hash'))
    await(queryInterface.removeColumn( 'organization', 'api_key'))
  }),

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
