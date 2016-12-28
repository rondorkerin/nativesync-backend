'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.renameTable('client', 'organization'))
    await(queryInterface.renameTable('client_auth', 'organization_auth'))
    await(queryInterface.renameColumn('organization_auth', 'client_id', 'organization_id'))
    await(queryInterface.renameTable('client_datastore', 'organization_datastore'))
    await(queryInterface.renameColumn('organization_datastore', 'client_id', 'organization_id'))
    await(queryInterface.renameTable('client_system_auth', 'organization_system_auth'))
    await(queryInterface.renameColumn('organization_system_auth', 'client_id', 'organization_id'))
    await(queryInterface.renameColumn('action', 'partner_id', 'organization_id'))
    await(queryInterface.renameColumn('integration', 'partner_id', 'organization_id'))
    await(queryInterface.renameColumn('integration_instance', 'client_id', 'organization_id'))
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
