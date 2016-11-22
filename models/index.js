var Action = require('./action')
var ActionServiceAuth = require('./action_service_auth')
var Client = require('./client')
var ClientSystemAuth = require('./client_system_auth')
var ClientAuth = require('./client_auth')
var ClientDatastore = require('./client_datastore')
var Integration = require('./integration')
var IntegrationInstance = require('./integration_instance')
var Partner = require('./partner')
var Service = require('./service')
var ServiceAuth = require('./service_auth')
var User = require('./user')
var UserSystemAuth = require('./user_system_auth')
var UserClient = require('./user_client')
var UserPartner = require('./user_partner')

Action.belongsToMany(ServiceAuth, {as: 'ServiceAuths', through: ActionServiceAuth, foreignKey: 'action_id', otherKey: 'service_auth_id'});
User.belongsToMany(Client, {as: 'Clients', through: UserClient, foreignKey: 'user_id', otherKey: 'client_id'});
Integration.belongsToMany(Service, {as: 'Services', through: 'IntegrationService', foreignKey: 'integration_id', otherKey: 'service_id'});
Service.belongsToMany(Integration, {as: 'Integrations', through: 'IntegrationService', foreignKey: 'service_id', otherKey: 'integration_id'});
User.belongsToMany(Partner, {as: 'Partners', through: UserPartner, foreignKey: 'user_id', otherKey: 'partner_id'});
ServiceAuth.hasMany(ClientAuth, { as: 'ClientAuths', foreignKey: 'service_auth_id'})
ClientAuth.belongsTo(ServiceAuth, { foreignKey: 'service_auth_id' })
ClientDatastore.belongsTo(Client, { foreignKey: 'client_id' })
Client.hasMany(ClientDatastore, { foreignKey: 'client_id' })
ClientAuth.belongsTo(Service, { foreignKey: 'service_id' })
Integration.belongsTo(User, { foreignKey: 'creator_user_id' })
Integration.belongsTo(Partner, { foreignKey: 'partner_id' })
IntegrationInstance.belongsTo(Client, { foreignKey: 'client_id' })
IntegrationInstance.belongsTo(Integration, { foreignKey: 'integration_id' })
ClientAuth.belongsTo(Client, { foreignKey: 'client_id' })
Service.hasMany(ServiceAuth, { as: 'ServiceAuths', foreignKey: 'service_id'})
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
  'Partner': Partner,
  'Service': Service,
  'ServiceAuth': ServiceAuth,
  'User': User,
  'UserSystemAuth': UserSystemAuth,
  'UserClient': UserClient,
  'UserPartner': UserPartner
}
