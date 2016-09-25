let Promise = require('bluebird');

class Connector {
  constructor(userAuth) {
    this.userAuth = userAuth;
  }

  call(service, functionName, args) {
    // todo: get from DB
    let serviceDescription = {
      driver: 'custom',
      service: service,
      spec: {}
    }
    let auth = this.userAuth[service];
    // route to external Connector
    let Driver = require(`./connector_drivers/${serviceDescription.driver}`)
    return new Driver(serviceDescription).call(this.userAuth, functionName, args)
  }
}

module.exports = Connector;
