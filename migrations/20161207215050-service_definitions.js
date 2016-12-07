'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.createTable('service_definition', {
        id: {
          type: Sequelize.BIGINT,
          primaryKey: true,
          autoIncrement: true
        },
        service_id: {
          type: Sequelize.BIGINT
        },
        name: {
          type: Sequelize.STRING
        },
        definition: {
          type: Sequelize.JSON
        },
        createdAt: {
          type: Sequelize.DATE
        },
        updatedAt: {
          type: Sequelize.DATE
        }
      }));

      await(queryInterface.addIndex('service_definition', ['service_id', 'name'], {indicesType: 'UNIQUE'}));
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
