let Promise = require('bluebird');
let Service = require('../models/service');

class Connector {
  constructor(clientAuth) {
    this.clientAuth = clientAuth;
  }

  call(service, functionName, args) {
    return Service.get(service)
    .then(function(serviceDescription) {
      // route to external Connector
      let Driver = require(`./connector_drivers/${serviceDescription.driver}`)
      return new Driver(serviceDescription).call(this.clientAuth, functionName, args)
    })
  }
}

module.exports = Connector;
