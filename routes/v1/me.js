'use strict'
let await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/me', helpers.checkauth('organization'), (req, res) => {
    return res.json(req.user);
  });
}
