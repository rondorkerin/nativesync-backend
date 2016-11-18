'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('user_partner', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true
      },
      user_id: {
        type: Sequelize.BIGINT
      },
      partner_id: {
        type: Sequelize.BIGINT
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
