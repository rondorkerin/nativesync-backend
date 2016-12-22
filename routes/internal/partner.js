var Models = require('../../models')
var Partner = Models.Partner;
var async = require('asyncawait/async');
const await = require('asyncawait/await')

module.exports = (app, helpers) => {
  app.post('/partners/upsert', helpers.checkauth('user'), function(req, res) {
    let result;
    let partner = req.body.partner;

    try {
      if (partner.id) {
        await(Partner.update(partner, {where: {id: partner.id}}))
        partner = await(Partner.findById(partner.id));
      } else {
        partner = await(Partner.create(partner))
      }

      await(partner.addUser(req.user.id));

      return res.json({partner: partner});
    } catch(e) {
      console.log('error', e);
      return res.status(500).send(e);
    }
  });
  app.get('/partner/:id', helpers.checkauth('user'), (req, res) => {
    // todo: lock this down (validate the partner_id in the filter)
    var partner = await(Partner.findById(req.params.id))
    if (partner) {
      return res.json({partner: partner});
    } else {
      return res.status(400).send('no such partner');
    }
  });
}
