'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn('action', 'visibility', Sequelize.STRING))
    await(queryInterface.addColumn('service', 'visibility', Sequelize.STRING))
    await(queryInterface.addColumn('integration', 'visibility', Sequelize.STRING))
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
