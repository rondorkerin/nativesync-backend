var Models = require('../../models')
var Organization = Models.Organization;
var async = require('asyncawait/async');
const await = require('asyncawait/await')

module.exports = (app, helpers) => {
  app.post('/organizations/upsert', helpers.checkauth('user'), function(req, res) {
    let result;
    let organization = req.body.organization;

    try {
      if (organization.id) {
        await(Organization.update(organization, {where: {id: organization.id}}))
        organization = await(Organization.findById(organization.id));
      } else {
        organization = await(Organization.create(organization))
      }

      await(organization.addUser(req.user.id));

      return res.json({organization: organization});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });
  app.get('/organization/:id', helpers.checkauth('user'), (req, res) => {
    // todo: lock this down (validate the organization_id in the filter)
    var organization = await(Organization.findById(req.params.id))
    if (organization) {
      return res.json({organization: organization});
    } else {
      return res.status(400).send('no such organization');
    }
  });

  app.get('/organizations', helpers.checkauth('user'), (req, res) => {
    var organizations = await(Organization.findAll());
    if (organizations) {
      return res.json({organizations: organizations});
    } else {
      return res.status(400).send('no such organization');
    }
  });
}
