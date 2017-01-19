'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn( 'organization', 'contact_name', Sequelize.STRING))
    await(queryInterface.addColumn( 'organization', 'contact_phone', Sequelize.STRING))
    await(queryInterface.addColumn( 'organization', 'contact_email', Sequelize.STRING))
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
