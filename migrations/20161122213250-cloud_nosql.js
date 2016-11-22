'use strict';
var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.createTable('client_datastore', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      client_id: {
        type: Sequelize.BIGINT
      },
      key: {
        type: Sequelize.STRING
      },
      value: {
        type: Sequelize.JSONB
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }));
    await(queryInterface.addIndex('client_datastore', ['client_id', 'key'],{indicesType: 'UNIQUE'}));
  }),

  down: function (queryInterface, Sequelize) {
    /*
 *       Add reverting commands here.
 *             Return a promise to correctly handle asynchronicity.
 *
 *                   Example:
 *                         return queryInterface.dropTable('clients');
 *                             */
  }
};

