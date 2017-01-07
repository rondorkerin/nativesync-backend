'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn( 'organization', 'billing_organization_id', Sequelize.BIGINT))
    await(queryInterface.addColumn( 'organization', 'managing_organization_id', Sequelize.BIGINT))
    await(queryInterface.addColumn( 'organization', 'external_identifier', Sequelize.STRING))
    await(queryInterface.removeColumn( 'organization', 'partner_id'))
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
