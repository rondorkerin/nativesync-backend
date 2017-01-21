require('use-strict')
var Models = require('../models')
var _ = require('underscore');

var fs = require('fs');
var csv = require('csv');

var data = fs.readFileSync('./data/companies_1000.csv');
csv.parse(data, function(err, data){
  console.log('data', data);
  _.each(data, function(row) {
    Models.Service.upsert({name: row[0], description: row[4], domain: row[1]});
  })
});

