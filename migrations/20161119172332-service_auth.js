'use strict';

var async = require('asyncawait/async');
var await = require('asyncawait/await');


module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addIndex('service_auth', ['service_id', 'name'],{indicesType: 'UNIQUE'}));
    await(queryInterface.addIndex('partner', ['name'],{indicesType: 'UNIQUE'}));
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
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
