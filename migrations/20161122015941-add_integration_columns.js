'use strict';

var async = require('asyncawait/async')
var await = require('asyncawait/await')

module.exports = {
  up: async(function (queryInterface, Sequelize) {
		await(queryInterface.addColumn( 'integration', 'partner_id', Sequelize.BIGINT))
		await(queryInterface.removeColumn( 'integration', 'client_id', Sequelize.BIGINT))
		await(queryInterface.addColumn( 'integration', 'creator_user_id', Sequelize.BIGINT))
		await(queryInterface.addColumn( 'integration', 'title', Sequelize.STRING))
		await(queryInterface.addColumn( 'integration', 'version', Sequelize.STRING))
		await(queryInterface.addColumn( 'integration', 'language', Sequelize.STRING))
		await(queryInterface.addColumn( 'integration', 'code', Sequelize.TEXT))
		await(queryInterface.addColumn( 'integration', 'documentation', Sequelize.TEXT))
		await(queryInterface.addColumn( 'integration', 'privacy', Sequelize.STRING))
		await(queryInterface.addColumn( 'integration', 'pricing', Sequelize.JSON))
		await(queryInterface.addColumn( 'integration', 'onboarding', Sequelize.JSON))
		await(queryInterface.addColumn( 'integration', 'required_service_auth_ids', Sequelize.JSON))
		await(queryInterface.addColumn( 'integration', 'referrals', Sequelize.JSON))

	 await(queryInterface.createTable('integration_instance', {
				id: {
					type: Sequelize.BIGINT,
					primaryKey: true,
					autoIncrement: true
				},
				client_id: {
					type: Sequelize.BIGINT
				},
				integration_id: {
					type: Sequelize.BIGINT
				},
				scheduling_info: {
					type: Sequelize.JSON
				},
				inputs: {
					type: Sequelize.JSON
				},
				createdAt: {
					type: Sequelize.DATE
				},
				updatedAt: {
					type: Sequelize.DATE
				}
			}));
	 await(queryInterface.createTable('integration_service', {
				id: {
					type: Sequelize.BIGINT,
					primaryKey: true,
					autoIncrement: true
				},
				service_id: {
					type: Sequelize.BIGINT
				},
				integration_id: {
					type: Sequelize.BIGINT
				},
				createdAt: {
					type: Sequelize.DATE
				},
				updatedAt: {
					type: Sequelize.DATE
				}
			}));
    await(queryInterface.addIndex('integration_service', ['service_id', 'integration_id'], {indicesType: 'UNIQUE'}));
    await(queryInterface.addIndex('integration_instance', ['client_id']));//,{indicesType: 'UNIQUE'}));
    await(queryInterface.addIndex('integration_instance', ['integration_id']));
    await(queryInterface.addIndex('integration', ['partner_id']));
    await(queryInterface.addIndex('integration', ['creator_user_id']));
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  }),

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
  }
};
