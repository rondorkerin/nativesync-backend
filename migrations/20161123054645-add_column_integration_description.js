'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn('integration', 'description', Sequelize.STRING))
    await(queryInterface.addColumn('partner', 'avatar_url', Sequelize.STRING))
    await(queryInterface.addColumn('client', 'avatar_url', Sequelize.STRING))
    await(queryInterface.addColumn('user', 'avatar_url', Sequelize.STRING))
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
