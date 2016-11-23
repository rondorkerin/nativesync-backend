'use strict';
var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn( 'integration_instance', 'active', Sequelize.BOOLEAN))
		await(queryInterface.addIndex('integration', ['partner_id', 'title', 'version'] ,{indicesType: 'UNIQUE'}));
  }),

  down: async(function (queryInterface, Sequelize) {
    await(queryInterface.removeColumn( 'integration_instance', 'active'))
  })
};
