'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('action_service_auth', {
      id: {
        type: Sequelize.BIGINT,
        primaryKey: true,
        autoIncrement: true
      },
      action_id: {
        type: Sequelize.BIGINT
      },
      service_auth_id: {
        type: Sequelize.BIGINT
      },
      createdAt: {
        type: Sequelize.DATE
      },
      updatedAt: {
        type: Sequelize.DATE
      }
    });
  },

  down: function (queryInterface, Sequelize) {
  }
};

