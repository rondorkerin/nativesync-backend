let await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/me', helpers.checkauth('client'), (req, res) => {
    return res.json(req.user);
  });
}
