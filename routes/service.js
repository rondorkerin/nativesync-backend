let Service = require('../models/service');

module.exports = function(app, passport, helpers) {
  app.get('/services', function(req, res) {
    return Service.getAll()
    .then((results) => {
      return res.json(results);
    })
  });
}
