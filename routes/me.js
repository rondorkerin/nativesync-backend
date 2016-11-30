let await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/me/associations', (req, res) => {
    var partners = await(req.user.getPartners());
    var clients = await(req.user.getClients());
    return res.json({clients: clients, partners: partners});
  });
}
