'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn('integration', 'internal_name', Sequelize.STRING))
    await(queryInterface.addColumn('integration_instance', 'internal_name', Sequelize.STRING))
    await(queryInterface.addColumn('action', 'title', Sequelize.STRING))
		await(queryInterface.addIndex('integration', ['partner_id', 'internal_name'] ,{indicesType: 'UNIQUE'}));
		await(queryInterface.addIndex('integration_instance', ['client_id', 'internal_name'] ,{indicesType: 'UNIQUE'}));
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
