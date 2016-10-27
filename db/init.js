let force;
if (process.env['NODE_ENV'] == 'production') {
  force = false;
} else {
  force = true;
}

let models = [
  'client',
  'client_auth',
  'partner',
  'user',
  'user_client',
  'user_partner',
  'connector',
  'connector_service_auth',
  'integration',
  'service',
  'service_auth',
]
models.forEach((model) => {
  let instance = require('../models/' + model);
  instance.sync({force: force})
})
