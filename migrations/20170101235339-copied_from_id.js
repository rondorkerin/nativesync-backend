'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
    await(queryInterface.addColumn('action', 'copied_from_id', Sequelize.BIGINT))
    await(queryInterface.addColumn('service', 'copied_from_id', Sequelize.BIGINT))
    await(queryInterface.addColumn('integration', 'copied_from_id', Sequelize.BIGINT))
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
