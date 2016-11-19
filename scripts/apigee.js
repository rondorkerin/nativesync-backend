var FS = require('fs');
var Request = require('request');
var XML2JS = require('xml2json').toJson;
var Converter = require('api-spec-converter');

var API_DIR = __dirname + '/../connections';

Request.get('http://api.apigee.com/v1/consoles', {json: true}, function(err, resp, body) {
  body.console.forEach(function(c) {
    try {
      Converter.convert({
        from: 'wadl',
        to: 'swagger_2',
        source: c.wadlUrl,
      }, function(err, converted) {
        if (err) return console.log(err);
        converted.spec.info = {
          title: c.displayName,
          description: c.description,
        }
        var key = 'apigee:' + c.name;
        var data = {
          type: 'api',
          key: key,
          info: converted.spec.info,
          swagger: converted.spec,
          public: true
        };
        FS.writeFileSync(API_DIR + '/' + key + '.json', JSON.stringify(data, null, 2));
      })
    } catch(e) {console.log(e)}
  })
})
