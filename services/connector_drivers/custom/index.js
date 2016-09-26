class CustomDriver {
  constructor(serviceDescription) {
    this.serviceDescription = serviceDescription;  
  }

  call(userAuth, functionName, args) {
    let CustomAPIConnector = require(`./${this.serviceDescription.name}`);
    return new CustomAPIConnector(userAuth)[functionName].call(args);
  }
}

module.exports = CustomDriver;
