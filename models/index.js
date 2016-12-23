var Action = require('./action')
var ActionServiceAuth = require('./action_service_auth')
var Client = require('./client')
var ClientSystemAuth = require('./client_system_auth')
var ClientAuth = require('./client_auth')
var ClientDatastore = require('./client_datastore')
var Integration = require('./integration')
var IntegrationInstance = require('./integration_instance')
var IntegrationCode = require('./integration_code')
var Partner = require('./partner')
var Service = require('./service')
var ServiceAuth = require('./service_auth')
var ServiceDefinition = require('./service_definition')
var User = require('./user')
var UserSystemAuth = require('./user_system_auth')
var UserClient = require('./user_client')
var UserPartner = require('./user_partner')

Action.belongsToMany(ServiceAuth, {as: 'ServiceAuths', through: ActionServiceAuth, foreignKey: 'action_id', otherKey: 'service_auth_id'});
Action.belongsTo(Service, { foreignKey: 'service_id' })
Action.belongsToMany(Integration, {as: 'Integrations', through: 'integration_action', foreignKey: 'action_id', otherKey: 'integration_id'});
User.belongsToMany(Client, {as: 'Clients', through: UserClient, foreignKey: 'user_id', otherKey: 'client_id'});
Integration.belongsToMany(Service, {as: 'Services', through: 'integration_service', foreignKey: 'integration_id', otherKey: 'service_id'});
Integration.belongsToMany(Action, {as: 'Actions', through: 'integration_action', foreignKey: 'integration_id', otherKey: 'action_id'});
Service.belongsToMany(Integration, {as: 'Integrations', through: 'integration_service', foreignKey: 'service_id', otherKey: 'integration_id'});
User.belongsToMany(Partner, {as: 'Partners', through: UserPartner, foreignKey: 'user_id', otherKey: 'partner_id'});
Partner.belongsToMany(User, {as: 'Users', through: UserPartner, foreignKey: 'partner_id', otherKey: 'user_id'});
Client.belongsToMany(User, {as: 'Users', through: UserClient, foreignKey: 'client_id', otherKey: 'user_id'});
ServiceAuth.hasMany(ClientAuth, { as: 'ClientAuths', foreignKey: 'service_auth_id'})
Service.hasMany(ServiceAuth, { as: 'ServiceAuths', foreignKey: 'service_id'})
ServiceAuth.belongsTo(Service, { foreignKey: 'service_id'})
ClientAuth.belongsTo(ServiceAuth, { foreignKey: 'service_auth_id' })
ClientDatastore.belongsTo(Client, { foreignKey: 'client_id' })
Client.hasMany(ClientDatastore, { foreignKey: 'client_id' })
ClientAuth.belongsTo(Service, { foreignKey: 'service_id' })
Integration.belongsTo(User, { foreignKey: 'creator_user_id' })
Integration.belongsTo(Partner, { foreignKey: 'partner_id' })
IntegrationInstance.belongsTo(Client, { foreignKey: 'client_id' })
IntegrationInstance.belongsTo(Integration, { foreignKey: 'integration_id' })
IntegrationInstance.hasOne(IntegrationCode, { foreignKey: 'integration_instance_id' })
IntegrationCode.belongsTo(IntegrationInstance, { foreignKey: 'integration_instance_id' })
ClientAuth.belongsTo(Client, { foreignKey: 'client_id' })
Service.hasMany(ServiceAuth, { as: 'ServiceAuths', foreignKey: 'service_id'})
Service.hasMany(ServiceDefinition, { as: 'ServiceDefinitions', foreignKey: 'service_id'})
UserSystemAuth.belongsTo(User, { foreignKey: 'user_id' })
ClientSystemAuth.belongsTo(Client, { foreignKey: 'client_id' })

module.exports = {
  'Action': Action,
  'ActionServiceAuth': ActionServiceAuth,
  'Client': Client,
  'ClientAuth': ClientAuth,
  'ClientSystemAuth': ClientSystemAuth,
  'ClientDatastore': ClientDatastore,
  'Integration': Integration,
  'IntegrationInstance': IntegrationInstance,
  'IntegrationCode': IntegrationCode,
  'Partner': Partner,
  'Service': Service,
  'ServiceAuth': ServiceAuth,
  'User': User,
  'UserSystemAuth': UserSystemAuth,
  'UserClient': UserClient,
  'UserPartner': UserPartner
}
