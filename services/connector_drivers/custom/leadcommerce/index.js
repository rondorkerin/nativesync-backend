var q = require('q')
var request = require('request');
// require('request-debug')(request);

function Service(credentials) {
  this.triggers = [] //put function names which are considered triggers
  this.set_credentials(credentials)
}

Service.prototype.set_credentials = function(credentials) {
  this.credentials = credentials;
  this.base_url = "http://" + credentials['domain'] + ".goleadcommerce.com/api/v2";
  this.defaults = {
    'method': 'POST',
    'headers': {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'Authorization': 'Basic ' + new Buffer(this.credentials['identifier'] + ':' + this.credentials['key']).toString('base64')
    }
  }
}

function formatInput(input) {
  return {data: JSON.stringify(input)};
}

Service.prototype.get_orders = function(input) {
  debugger;
  var options = this.defaults;
  var url = this.base_url + '/orders.json';
  options['url'] = url;
  options['form'] = formatInput(input);
  return q.Promise(function(resolve, reject) {
    request(options, function (error, response, body) {
      debugger;
      resolve(JSON.parse(body).data);
    });
  });
};

Service.prototype.get_order_info = function(input) {
  var options = this.defaults;
  var url = this.base_url + '/orders/info.json';
  options['url'] = url;
  options['form'] = formatInput({id: input.order_ids})
  debugger;
  return q.Promise(function(resolve, reject) {
    // require('request-debug')(request);
    request(options, function (error, response, body) {
      debugger
      resolve(JSON.parse(body).data);
    });
  });
};

Service.prototype.get_order_product_info = function(input) {
  var options = this.defaults;
  var url = this.base_url + '/products/info_product.json';
  options['url'] = url;
  options['form'] = formatInput({ id: input.order_ids })
  return q.Promise(function(resolve, reject) {
    request(options, function (error, response, body) {
      resolve(JSON.parse(body).data);
    });
  });
};


module.exports = Service;
