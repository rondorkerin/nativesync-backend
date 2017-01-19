'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('user', 'name', Sequelize.STRING),
      queryInterface.removeColumn('user', 'first_name'),
      queryInterface.removeColumn('user', 'last_name'),
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('user', 'name'),
      queryInterface.addColumn('user', 'first_name', Sequelize.STRING),
      queryInterface.addColumn('user', 'last_name', Sequelize.STRING),
    ];
  }
};
