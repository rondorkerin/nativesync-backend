'use strict';
var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.createTable('client_system_auth', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      client_id: {
        type: Sequelize.BIGINT
      },
      token: {
        type: Sequelize.STRING
      },
      hash: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }));
    await(queryInterface.addIndex('client_system_auth', ['token'],{indicesType: 'UNIQUE'}));
    await(queryInterface.addIndex('client_system_auth', ['hash']));
  }),

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('clients');
    */
  }
};

