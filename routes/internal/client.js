var Models = require('../../models')
var Client = Models.Client;
var async = require('asyncawait/async');
const await = require('asyncawait/await')

module.exports = (app, helpers) => {
  app.post('/clients/upsert', helpers.checkauth('user'), function(req, res) {
    let result;
    let client = req.body.client;

    try {
      if (client.id) {
        await(Client.update(client, {where: {id: client.id}}))
        client = await(Client.findById(client.id));
      } else {
        client = await(Client.create(client))
      }

      await(client.addUser(req.user.id));

      return res.json({client: client});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });
  app.get('/client/:id', helpers.checkauth('user'), (req, res) => {
    // todo: lock this down (validate the partner_id in the filter)
    var client = await(Client.findById(req.params.id))
    if (client) {
      return res.json({client: client});
    } else {
      return res.status(400).send('no such client');
    }
  });
}
