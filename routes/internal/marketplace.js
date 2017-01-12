'use strict';
const Models = require('../../models');
const Integration = Models.Integration;

module.exports = (app) => {

  app.get('/marketplace/integrations', (req, res) => {
    var filter = req.query;
    Integration.findAll({
      where: filter,
      include: [
        {model: Models.Service, as: 'Services'},
        Models.Organization,
        Models.User,
      ],
      order: ['organization_id', 'title', ['version', 'desc']]
    }).then(integrations => { return res.json({integrations: integrations}); });
  });

  app.get('/marketplace/integration/:id', (req, res) => {
    // todo: lock this down (validate the organization_id in the filter)
    Integration.findById(
          req.params.id,
          {include: [
            {model: Models.Service, as: 'Services', include: [{model: Models.ServiceDefinition, as: 'ServiceDefinitions'}]},
            Models.Organization,
            Models.User,
          ]}
    ).then(integration => integration ?
      // if an integration matching the given id was found, return it
      res.json({ integration }) :

      // otherwise, return 400 not found
      res.status(400).send('no such integration')
    );
  });

};
