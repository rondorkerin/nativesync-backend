'use strict';
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = {
  up: async( function (queryInterface, Sequelize) {
    await(queryInterface.addIndex( 'action',['service_name','function_name'],{ indicesType: 'UNIQUE'}));

    await(queryInterface.addIndex( 'action',['service_id']));

    await(queryInterface.addIndex( 'action', ['creator_user_id']));
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
