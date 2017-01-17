'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('user', 'first_name', Sequelize.STRING),
      queryInterface.addColumn('user', 'last_name', Sequelize.STRING),
    ];
  },

  down: function (queryInterface) {
    return [
      queryInterface.removeColumn('user', 'first_name'),
      queryInterface.removeColumn('user', 'last_name'),
    ];
  }
};
