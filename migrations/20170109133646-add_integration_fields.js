'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('integration', 'support_policy', Sequelize.STRING),
      // may decide to get rid of this one later. The same information could
      // probably just go in the pricing column since it's JSON
      queryInterface.addColumn('integration', 'purchase_options', Sequelize.STRING)
    ];
  },

  down: function (queryInterface) {
    return [
      queryInterface.removeColumn('integration', 'support_policy'),
      queryInterface.removeColumn('intgeration', 'purchase_options')
    ];
  }
};
