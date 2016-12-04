'use strict';
var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.createTable('service_auth_secret', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      service_auth_id: {
        type: Sequelize.BIGINT
      },
      secret: {
        type: Sequelize.JSON
      },
      createdAt: {
        type: Sequelize.DATE
			},
      updatedAt: {
        type: Sequelize.DATE
			}
		}))
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
