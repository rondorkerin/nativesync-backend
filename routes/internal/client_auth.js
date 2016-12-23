var Models = require('../../models')
var ClientAuth = Models.ClientAuth;
var async = require('asyncawait/async');
var await = require('asyncawait/await');

module.exports = (app, helpers) => {
  app.get('/client_auths', helpers.checkauth('user'), (req, res) => {
    // todo: lock this down (validate the partner_id in the filter)
		var serviceAuthIds = req.query.service_auth_ids;
		var clientId = req.query.client_id;
		try {
			var clientAuths = await(Models.ClientAuth.findAll({where: {
				client_id: clientId,
				service_auth_id: {
					$in: serviceAuthIds
				}
			}}));
			return res.json({client_auths: clientAuths});
		} catch(e) {
			console.log('error', e);
			return res.status(500).send(e);
		}
	});

  app.post('/auth_credentials', helpers.checkauth(), (req, res) => {
    var credentials = req.body.credentials;
    credentials.client_id = req.user.id;
    return ClientAuth.create(credentials).then((results) => {
      return res.json({success: true});
    })
  });

  app.get('/auth_credentials', helpers.checkauth(), (req, res) => {
    return ClientAuth.findAll({where: {client_id: req.user.id}}).then((results) => {
      return res.json(results);
    })
  });

  app.get('/auth_credentials/:service', helpers.checkauth(), (req, res) => {
    return ClientAuth._getAllForService(req.user.id, req.params['service']).then((results) => {
      return res.json(results);
    })
  });
}
