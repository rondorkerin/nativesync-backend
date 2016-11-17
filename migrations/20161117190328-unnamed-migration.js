'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.addColumn('action', 'input_example', Sequelize.JSON)
    .then(function() {
      return queryInterface.addColumn('action', 'output_example', Sequelize.JSON)
    })
    .then(function() {
      return queryInterface.addColumn('action', 'input_content_type', Sequelize.STRING)
    })
    .then(function() {
      return queryInterface.addColumn('action', 'query', Sequelize.JSON)
    })
    .then(function() {
      return queryInterface.addColumn('action', 'output_content_type', Sequelize.STRING)
    })
    .then(function() {
      return queryInterface.addColumn('action', 'headers', Sequelize.JSON)
    })
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.removeColumn('action', 'input_example')
    .then(function() {
      return queryInterface.removeColumn('action', 'output_example')
    })
    .then(function() {
      return queryInterface.removeColumn('action', 'headers')
    })
    .then(function() {
      return queryInterface.removeColumn('action', 'query')
    })
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
