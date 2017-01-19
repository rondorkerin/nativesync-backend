'use strict';
var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.createTable('integration_request', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      organization_id: {
        type: Sequelize.BIGINT
      },
      assigned_organization_id: {
        type: Sequelize.BIGINT
      },
      jobStatus: {
        type: Sequelize.STRING
      },
      services: {
        type: Sequelize.JSON
      },
      steps: {
        type: Sequelize.JSON
      },
      consultantLevel: {
        type: Sequelize.STRING
      },
      newServices: {
        type: Sequelize.JSON
      },
      discount: {
        type: Sequelize.FLOAT
      },
      discountCode: {
        type: Sequelize.STRING
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    }));
    await(queryInterface.addIndex('integration_request', ['organization_id']));
    await(queryInterface.addIndex('integration_request', ['assigned_organization_id']));
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
