class CustomDriver {
  constructor(serviceDescription) {
    this.serviceDescription = serviceDescription;  
  }

  call(userAuth, functionName, args) {
    let CustomAPIConnector = require(`./custom_drivers/${this.serviceDescription.service}`);
    debugger;
    return new CustomAPIConnector(userAuth)[functionName].call(args);
  }
}

module.exports = CustomDriver;
