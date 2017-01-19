'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn( 'integration_request', 'type', Sequelize.STRING))
    await(queryInterface.addColumn( 'integration_request', 'integration_id', Sequelize.BIGINT))
    await(queryInterface.addColumn( 'integration_request', 'cost', Sequelize.FLOAT))
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
