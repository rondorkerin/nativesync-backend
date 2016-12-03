'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn('integration_code', 'integration_instance_id', Sequelize.BIGINT))
    await(queryInterface.addIndex('integration_code', ['integration_instance_id'] ,{indicesType: 'UNIQUE'}));
    await(queryInterface.removeColumn('integration_code', 'integration_id'));
    await(queryInterface.addColumn('action', 'api_version', Sequelize.STRING));
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
