var Action = require('./action')
var ActionServiceAuth = require('./action_service_auth')
var Client = require('./client')
var ClientAuth = require('./client_auth')
var Integration = require('./integration')
var Partner = require('./partner')
var Service = require('./service')
var ServiceAuth = require('./service_auth')
var User = require('./user')
var UserClient = require('./user_client')
var UserPartner = require('./user_partner')

Action.belongsToMany(ServiceAuth, {as: 'ServiceAuths', through: ActionServiceAuth, foreignKey: 'action_id', otherKey: 'service_auth_id'});
ServiceAuth.hasMany(ClientAuth, { as: 'ClientAuths', foreignKey: 'service_auth_id'})
ClientAuth.belongsTo(ServiceAuth, { foreignKey: 'service_auth_id' })
ClientAuth.belongsTo(Service, { foreignKey: 'service_id' })
ClientAuth.belongsTo(Client, { foreignKey: 'client_id' })
Service.hasMany(ServiceAuth, { as: 'ServiceAuths', foreignKey: 'service_id'})

module.exports = {
  'Action': Action,
  'ActionServiceAuth': ActionServiceAuth,
  'Client': Client,
  'ClientAuth': ClientAuth,
  'Integration': Integration,
  'Partner': Partner,
  'Service': Service,
  'ServiceAuth': ServiceAuth,
  'User': User,
  'UserClient': UserClient,
  'UserPartner': UserPartner
}
