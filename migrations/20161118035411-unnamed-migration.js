'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    queryInterface.createTable('action_service_auth', {
      action_id: {
        type: Sequelize.BIGINT
      },
      service_auth_id: {
        type: Sequelize.BIGINT
      }
    });
  },

  down: function (queryInterface, Sequelize) {
  }
};

