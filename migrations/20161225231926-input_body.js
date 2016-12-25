'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn( 'action', 'input_body', Sequelize.JSON))
    await(queryInterface.addColumn( 'action', 'output_body', Sequelize.JSON))
    await(queryInterface.removeColumn( 'action', 'input_content_type'))
    await(queryInterface.removeColumn( 'action', 'output_content_type'))
    await(queryInterface.removeColumn( 'action', 'output'))
    await(queryInterface.removeColumn( 'action', 'output_example'))
    await(queryInterface.removeColumn( 'action', 'input_example'))
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
