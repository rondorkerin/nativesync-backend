'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('integration',{
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true
      },
      client_id: {
        type: Sequelize.BIGINT
      },
      type: {
        type: Sequelize.STRING
      },
      scheduling_info: {
        type: Sequelize.JSON
      },
      integration: {
        type: Sequelize.TEXT
      }
    });
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
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
