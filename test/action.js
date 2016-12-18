var Models = require('../models');
Models.Action.findById(1)
.then((action) => {
  debugger;
  return action.getService()
  .then((services) => {
    debugger;
    console.log(services);
    return action.getServiceAuths()
    .then((serviceAuths) => {
      debugger;
      console.log(serviceAuths);
    })
  })
})
