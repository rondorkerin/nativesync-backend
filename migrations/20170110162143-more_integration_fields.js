'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('integration', 'how_it_works', Sequelize.STRING),
      queryInterface.addColumn('integration', 'requirements', Sequelize.STRING),
      // NQ: removing this column since purchase options are implied by the pricing data.
      // This is a destructive (irreversible) change but there is no data yet so it's okay.
      queryInterface.removeColumn('integration', 'purchase_options')
    ];
  },

  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('integration', 'how_it_works'),
      queryInterface.removeColumn('integration', 'requirements'),
      queryInterface.addColumn('integration', 'purchase_options', Sequelize.STRING)
    ];
  }
};
