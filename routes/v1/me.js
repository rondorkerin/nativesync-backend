let await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/me', (req, res) => {
    return res.json(req.user);
  });
}
