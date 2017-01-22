'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('integration_request', 'details', Sequelize.TEXT),
    ];
  },

  down: function (queryInterface) {
    return [
      queryInterface.removeColumn('integration_request', 'details'),
    ];
  }
};
