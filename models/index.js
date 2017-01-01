var Action = require('./action')
var ActionServiceAuth = require('./action_service_auth')
var Organization = require('./organization')
var OrganizationSystemAuth = require('./organization_system_auth')
var OrganizationAuth = require('./organization_auth')
var OrganizationDatastore = require('./organization_datastore')
var Integration = require('./integration')
var IntegrationInstance = require('./integration_instance')
var IntegrationCode = require('./integration_code')
var Service = require('./service')
var ServiceAuth = require('./service_auth')
var ServiceDefinition = require('./service_definition')
var User = require('./user')
var UserSystemAuth = require('./user_system_auth')
var UserOrganization = require('./user_organization')

Action.belongsToMany(ServiceAuth, {as: 'ServiceAuths', through: ActionServiceAuth, foreignKey: 'action_id', otherKey: 'service_auth_id'});
Action.belongsTo(Service, { foreignKey: 'service_id' })
Action.belongsTo(Action, { as: 'copiedFrom', foreignKey: 'copied_from_id' })
Integration.belongsTo(Integration, { as: 'copiedFrom', foreignKey: 'copied_from_id' })
Service.belongsTo(Service, { as: 'copiedFrom', foreignKey: 'copied_from_id' })
Action.belongsToMany(Integration, {as: 'Integrations', through: 'integration_action', foreignKey: 'action_id', otherKey: 'integration_id'});
User.belongsToMany(Organization, {as: 'Organizations', through: UserOrganization, foreignKey: 'user_id', otherKey: 'organization_id'});
Integration.belongsToMany(Service, {as: 'Services', through: 'integration_service', foreignKey: 'integration_id', otherKey: 'service_id'});
Integration.belongsToMany(Action, {as: 'Actions', through: 'integration_action', foreignKey: 'integration_id', otherKey: 'action_id'});
Service.belongsToMany(Integration, {as: 'Integrations', through: 'integration_service', foreignKey: 'service_id', otherKey: 'integration_id'});
Organization.belongsToMany(User, {as: 'Users', through: UserOrganization, foreignKey: 'organization_id', otherKey: 'user_id'});
ServiceAuth.hasMany(OrganizationAuth, { as: 'OrganizationAuths', foreignKey: 'service_auth_id'})
Service.hasMany(ServiceAuth, { as: 'ServiceAuths', foreignKey: 'service_id'})
ServiceAuth.belongsTo(Service, { foreignKey: 'service_id'})
OrganizationAuth.belongsTo(ServiceAuth, { foreignKey: 'service_auth_id' })
OrganizationDatastore.belongsTo(Organization, { foreignKey: 'organization_id' })
Organization.hasMany(OrganizationDatastore, { foreignKey: 'organization_id' })
OrganizationAuth.belongsTo(Service, { foreignKey: 'service_id' })
Integration.belongsTo(User, { foreignKey: 'creator_user_id' })
Integration.belongsTo(Organization, { foreignKey: 'organization_id' })
IntegrationInstance.belongsTo(Organization, { foreignKey: 'organization_id' })
IntegrationInstance.belongsTo(Integration, { foreignKey: 'integration_id' })
IntegrationInstance.hasOne(IntegrationCode, { foreignKey: 'integration_instance_id' })
IntegrationCode.belongsTo(IntegrationInstance, { foreignKey: 'integration_instance_id' })
OrganizationAuth.belongsTo(Organization, { foreignKey: 'organization_id' })
Service.hasMany(ServiceAuth, { as: 'ServiceAuths', foreignKey: 'service_id'})
Service.hasMany(ServiceDefinition, { as: 'ServiceDefinitions', foreignKey: 'service_id'})
UserSystemAuth.belongsTo(User, { foreignKey: 'user_id' })
OrganizationSystemAuth.belongsTo(Organization, { foreignKey: 'organization_id' })

module.exports = {
  'Action': Action,
  'ActionServiceAuth': ActionServiceAuth,
  'Organization': Organization,
  'OrganizationAuth': OrganizationAuth,
  'OrganizationSystemAuth': OrganizationSystemAuth,
  'OrganizationDatastore': OrganizationDatastore,
  'Integration': Integration,
  'IntegrationInstance': IntegrationInstance,
  'IntegrationCode': IntegrationCode,
  'Service': Service,
  'ServiceAuth': ServiceAuth,
  'User': User,
  'UserSystemAuth': UserSystemAuth,
  'UserOrganization': UserOrganization,
}
