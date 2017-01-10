'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.changeColumn('integration', 'how_it_works', Sequelize.TEXT),
      queryInterface.changeColumn('integration', 'requirements', Sequelize.TEXT),
    ];
  },

  down: function (queryInterface, Sequelize) {
    // NQ: this rollback is almost surely destructive
    return [
      queryInterface.changeColumn('integration', 'how_it_works', Sequelize.STRING),
      queryInterface.changeColumn('integration', 'requirements', Sequelize.STRING),
    ];
  }
};
