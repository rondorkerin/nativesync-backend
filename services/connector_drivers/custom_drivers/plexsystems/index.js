var q = require('q')
var Connector = require('./connector/index.js');

function Service(credentials) {
  this.set_credentials(credentials)
}

Service.prototype.set_credentials = function(credentials) {
  this.credentials = credentials;
  this.connector = new Connector(credentials['username'], credentials['password'], null, credentials['use_test_api']);
  //returns a promise that resolves right away
  return q(credentials)
}

Service.prototype.add_ecommerce_order = function(input) {
  var self = this
  return q.Promise(function(resolve, reject) {
    self.connector.call('Ecommerce_Order_Add', {
      Customer_Code: input.customer_code,
      Ship_To_Customer_Address_Code: input.ship_to_customer_address_code,
      Bill_To_Customer_Address_Code: input.bill_to_customer_address_code,
    }).then(function(result) {
      if (result.error) {
        resolve({service_error: result.error});
      } else if (result.ExecuteDataSourcePostResult.Error == true) {
        resolve({service_error: result.ExecuteDataSourcePostResult.Message});
      }
      var output_params = results.ExecuteDataSourcePostResult.OutputParameters.OutputParameter[0];
      results = {}
      result_mapping = {
        '@Order_No': 'order_no',
        '@ResultCode': 'result_code',
        '@ResultMessage': 'result_message',
        '@ResultError': 'result_error'
      }
      output_params.forEach(function(param) {
        results[result_mapping[param['Name']]] = param['Value'];
      });
      resolve(results);
    }, function(error) {
      reject({internal_error: error});
    });
  });
};

Service.prototype.add_ecommerce_order_line = function(input) {
  var self = this
  return q.Promise(function(resolve, reject) {
    self.connector.call('Ecommerce_Order_Line_Add', {
      Customer_Code: input.customer_code,
      Order_No: input.order_no,
      Part_No: input.part_no,
      Price: input.price,
      Quantity: input.quantity,
    }).then(function(result) {
      if (result.error) {
        reject({service_error: result.error});
      } else if (result.ExecuteDataSourcePostResult.Error == true) {
        reject({service_error: result.ExecuteDataSourcePostResult.Message});
      }
      var output_params = results.ExecuteDataSourcePostResult.OutputParameters.OutputParameter[0];
      results = {}
      result_mapping = {
        '@ResultCode': 'result_code',
        '@ResultMessage': 'result_message',
        '@ResultError': 'result_error'
      }
      output_params.forEach(function(param) {
        results[result_mapping[param['Name']]] = param['Value'];
      });
      resolve(results);
    }, function(error) {
      reject({internal_error: error});
    });
  });
};


module.exports = Service;
