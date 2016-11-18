'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('service', {
      name: {
        type: Sequelize.STRING,
        unique: true
      },
      domain: {
        type: Sequelize.STRING,
        unique: true
      },
      logo_url: {
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
