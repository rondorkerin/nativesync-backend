var Models = require('../models');
Models.Action.findById(1)
.then((action) => {
  debugger;
  for (var i = 0; i < 5; i++) {
    console.log(i);
  }
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
