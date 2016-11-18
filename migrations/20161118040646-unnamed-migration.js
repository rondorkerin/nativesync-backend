'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('client', {
      partner_id: {
        type: Sequelize.BIGINT
      },
      name: {
        type: Sequelize.STRING
      },
      api_key: {
        type: Sequelize.STRING
      },
      url: {
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
