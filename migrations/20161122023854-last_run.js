'use strict';
var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn( 'integration_instance', 'last_run', Sequelize.DATE))
  }),

  down: async(function (queryInterface, Sequelize) {
    await(queryInterface.removeColumn( 'integration', 'last_run'))
  })
};
