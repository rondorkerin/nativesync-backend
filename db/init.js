"use strict"
require('use-strict');
let force;
if (process.env['NODE_ENV'] == 'production') {
  force = false;
} else {
  force = false;
}

let models = [
  'client',
  'client_auth',
  'partner',
  'user',
  'user_client',
  'user_partner',
  'action',
  'action_service_auth',
  'integration',
  'service',
  'service_auth',
]
models.forEach((model) => {
  let instance = require('../models/' + model);
  instance.sync({force: force})
})
