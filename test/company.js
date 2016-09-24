var company = require('../models/company');

company.create('test', 'test')
.then(function() {
  return company.getAll()
})
.then(console.log);

