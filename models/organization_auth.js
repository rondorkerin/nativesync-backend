'use strict';

let postgres = require('../drivers/postgres');
var async = require('asyncawait/async');
var _ = require('underscore');
var await = require('asyncawait/await');
let Sequelize = require('sequelize')

var OrganizationAuth = postgres.define('organization_auth', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  organization_id: {
    type: Sequelize.BIGINT
  },
  service_id: {
    type: Sequelize.BIGINT
  },
  service_auth_id: {
    type: Sequelize.BIGINT
  },
  value: {
    type: Sequelize.JSON
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  }
}, {
  freezeTableName: true,
  indexes: [{fields: ['organization_id', 'service_id']}, {fields: ['service_auth_id', 'organization_id'], unique: true}]
});


// get all configuration servie auths for an organization
OrganizationAuth.getConfigurations = async((serviceId, organizationId) => {
	var configurationServiceAuths = await(Models.ServiceAuth.findAll({
		where: {
			service_id: serviceId,
			type: 'configuration'
		}
	}));

	var configurationServiceAuthIds = _.pluck(configurationServiceAuths, 'id');
	var organizationConfigurations = await(Models.OrganizationAuth.findAll({
		where: {
			organization_id: organizationId,
			service_auth_id: {$in: configurationServiceAuthIds}
		}
	}));
	var configurations = {}
	for (var organizationAuth of organizationConfigurationAuths) {
		configurations = Object.assign(configurations, organizationAuth.value);
	}
	return configurations;
})


module.exports = OrganizationAuth
