'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn( 'integration_request', 'contact_email', Sequelize.STRING))
    await(queryInterface.addColumn( 'integration_request', 'contact_name', Sequelize.STRING))
    await(queryInterface.addColumn( 'integration_request', 'contact_phone', Sequelize.STRING))
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
