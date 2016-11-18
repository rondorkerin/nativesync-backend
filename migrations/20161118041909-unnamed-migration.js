'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('service_auth', {
      service_id: {
        type: Sequelize.BIGINT
      },
      type: {
        type: Sequelize.STRING
      },
      details: {
        type: Sequelize.JSON
      },
      name: {
        type: Sequelize.STRING
      }
    });
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
