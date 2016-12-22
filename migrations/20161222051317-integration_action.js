'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
   await(queryInterface.createTable('integration_action', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        action_id: {
          type: Sequelize.BIGINT
        },
        integration_id: {
          type: Sequelize.BIGINT
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      }));
    await(queryInterface.addIndex('integration_action', ['integration_id','action_id'], {indicesType: 'UNIQUE'}));
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
