var Action = require('./action')
var ActionServiceAuth = require('./action_service_auth')
var Organization = require('./organization')
var OrganizationSystemAuth = require('./organization_system_auth')
var OrganizationAuth = require('./organization_auth')
var OrganizationDatastore = require('./organization_datastore')
var Integration = require('./integration')
var IntegrationInstance = require('./integration_instance')
var IntegrationRequest = require('./integration_request')
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
Action.belongsTo(Organization, { foreignKey: 'organization_id' })
Action.belongsToMany(Integration, {as: 'Integrations', through: 'integration_action', foreignKey: 'action_id', otherKey: 'integration_id'});

Integration.belongsTo(User, { foreignKey: 'creator_user_id' })
Integration.belongsTo(Organization, { foreignKey: 'organization_id' })
Integration.belongsTo(Integration, { as: 'copiedFrom', foreignKey: 'copied_from_id' })
Integration.belongsToMany(Service, {as: 'Services', through: 'integration_service', foreignKey: 'integration_id', otherKey: 'service_id'});
Integration.belongsToMany(Action, {as: 'Actions', through: 'integration_action', foreignKey: 'integration_id', otherKey: 'action_id'});

IntegrationRequest.belongsTo(Organization, { foreignKey: 'organization_id' })
IntegrationRequest.belongsTo(Organization, { as: 'assignedTo', foreignKey: 'assigned_organization_id' })

User.hasOne(UserSystemAuth, { foreignKey: 'user_id' })
User.belongsToMany(Organization, {as: 'Organizations', through: UserOrganization, foreignKey: 'user_id', otherKey: 'organization_id'});
User.belongsTo(Organization, { as: 'org', foreignKey: 'default_organization_id'});

Organization.belongsToMany(User, {as: 'Users', through: UserOrganization, foreignKey: 'organization_id', otherKey: 'user_id'});
Organization.hasMany(OrganizationDatastore, { foreignKey: 'organization_id' })
Organization.hasMany(OrganizationSystemAuth, { foreignKey: 'organization_id' })
Organization.hasMany(Organization, { as: 'manages', foreignKey: 'managing_organization_id' })
Organization.hasMany(Organization, { as: 'paysBillFor', foreignKey: 'billing_organization_id' })
Organization.hasMany(IntegrationRequest, { as: 'requestedIntegrations', foreignKey: 'organiation_id' })
Organization.hasMany(IntegrationRequest, { as: 'assignedIntegrationRequests', foreignKey: 'assigned_organization_id' })
IntegrationRequest.belongsTo(Organization, { as: 'assignedTo', foreignKey: 'assigned_organization_id' })
Organization.belongsTo(Organization, { as: 'manager', foreignKey: 'managing_organization_id' })
Organization.belongsTo(Organization, { as: 'billedTo', foreignKey: 'billing_organization_id' })
Organization.hasMany(Service, { foreignKey: 'organization_id' })

ServiceAuth.hasMany(OrganizationAuth, { as: 'OrganizationAuths', foreignKey: 'service_auth_id'})
ServiceAuth.belongsTo(Service, { foreignKey: 'service_id'})

Service.belongsTo(Organization, { foreignKey: 'organization_id' })
Service.belongsTo(Service, { as: 'copiedFrom', foreignKey: 'copied_from_id' })
Service.belongsToMany(Integration, {as: 'Integrations', through: 'integration_service', foreignKey: 'service_id', otherKey: 'integration_id'});
Service.hasMany(ServiceAuth, { as: 'ServiceAuths', foreignKey: 'service_id'})
Service.hasMany(ServiceDefinition, { as: 'ServiceDefinitions', foreignKey: 'service_id'})
Service.hasMany(Action, { foreignKey: 'service_id'})

OrganizationAuth.belongsTo(ServiceAuth, { foreignKey: 'service_auth_id' })
OrganizationAuth.belongsTo(Service, { foreignKey: 'service_id' })
OrganizationAuth.belongsTo(Organization, { foreignKey: 'organization_id' })

OrganizationDatastore.belongsTo(Organization, { foreignKey: 'organization_id' })

IntegrationInstance.belongsTo(Organization, { foreignKey: 'organization_id' })
IntegrationInstance.belongsTo(Integration, { foreignKey: 'integration_id' })

IntegrationCode.belongsTo(Integration, { foreignKey: 'integration_id' })

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
  'ServiceDefinition': ServiceDefinition,
  'User': User,
  'UserSystemAuth': UserSystemAuth,
  'UserOrganization': UserOrganization,
}
