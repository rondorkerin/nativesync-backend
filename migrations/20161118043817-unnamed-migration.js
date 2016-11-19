'use strict';

var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addIndex('client', ['partner_id']));

    await(queryInterface.addIndex('client', ['api_key'],{indicesType: 'UNIQUE'}));

    await(queryInterface.addIndex('client_auth', ['client_id', 'service_id']));

    await(queryInterface.addIndex('service', ['name']));

    await(queryInterface.addIndex('service_auth', ['service_id']));

    await(queryInterface.addIndex('user_client', ['user_id', 'client_id'],{indicesType:'UNIQUE'}));

    await(queryInterface.addIndex('user_partner', ['user_id', 'partner_id'], {indicesType:'UNIQUE'}));

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
