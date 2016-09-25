let Service = require('../models/service');

module.exports = function(app, passport, helpers) {
  app.get('/services', helpers.checkauth(passport), function(req, res) {
    return Service.getAll()
    .then((results) => {
      return res.json(results);
    })
  });
}
