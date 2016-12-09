var Models = require('../models')

Models.User.findAll().then((user) => {
  debugger;
  console.log(user);
})
