'use strict';
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = {
  up: async( function (queryInterface, Sequelize) {
    await(queryInterface.dropIndex( 'action',['service_name','function_name'],{ indicesType: 'UNIQUE'}));
    await(queryInterface.addIndex( 'action',['service_name','function_name', 'organization_name', 'version'],{ indicesType: 'UNIQUE'}));
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
