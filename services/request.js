'use strict'
var Action = require('../models/action');
var Service = require('../models/service');
var Promise = require('bluebird');
var async = require('asyncawait/async');
var await = require('asyncawait/await');
var request = require('request-promise');
var o2x = require('object-to-xml');
var urljoin = require('url-join');
var MergeVariables = require('../helpers/merge_variables');
const CodeRunner = require('./code_runner');
const _ = require('underscore')
const url = require('url');

function RequiredParameterMissingException(message) {
   this.message = message;
   this.name = "RequiredParameterMissingException";
}

function RequiredAuthMissingException(message) {
   this.message = message;
   this.name = "RequiredAuthMissingException";
}

class Request {
  constructor(organization, action) {
    this.action = action;
    this.organizationID = organization.id;
    this.organization = organization;
  },
	getConfigurationAuths(serviceAuths, input) {
		for (serviceAuth of _.where(serviceAuths, {type: 'configuration'})) {
			input = Object.assign(organizationAuth.value, input);
		}
		return input;
	},
	// these are run right before the action runs to generate any last minute
	// headers, query params, etc.
  runCodeAuths(serviceAuths, organizationAuths, requestObject, input) {
		var output = {headers: {}, query: {}};
    organizationAuths = await(this.runCodeAuths(serviceAuths, organizationAuths));
		for (serviceAuth of _.where(serviceAuths, {type: 'code'})) {
			var codeRunner = new CodeRunner(this.organization, serviceAuth.details.code, {
				organizationAuths: organizationAuths,
				serviceAuths: serviceAuths,
				request: requestObject,
				action: this.action,
				input: input
			});
			output = Object.assign(output, await(codeRunner.run()));
		}
		return output;
  },
  send(input) {
    debugger;
    var serviceAuths = await(this.action.getServiceAuths());

    var headers = {}
    for (let header of this.action['headers']) {
      headers[header.key] = header.value;
    }
    var query = {}
    for (let pair of this.action['query']) {
      query[pair.key] = pair.value;
    }
    var bodyInput = {};
    var host = this.action['host'] ? this.action['host'] : {};
    var body = '';
    var requestObject = {}
    var path = this.action['path'];

		var organizationAuths = await(Models.OrganizationAuth.findAll({
			where: {
				service_auth_id: { '$in': _.pluck(serviceAuths, 'id') },
				organization_id: this.organizationID
			}
		}))
		// get configuration variables as these might be required for dynamic auths
		input = this.getConfigurationAuths(serviceAuths, input);

		organizationAuthsByServiceAuthId = _.indexBy(organizationAuths, 'service_auth_id');

    // authentication processing
    for (let serviceAuth of serviceAuths) {
			var organizationAuth = organizationAuthsByServiceAuthId[serviceAuth.id];
      // action type auths dont necessarily have org auths
      if (!organizationAuth && serviceAuth['required'] && serviceAuth.type != 'action') {
        throw new RequiredAuthMissingException(serviceAuth['name']);
      }

      if (serviceAuth.type == 'basic') {
        requestObject.auth = organizationAuth.value;
      } else if (serviceAuth.type == 'apiKey') {
        if (serviceAuth.details['in'] == 'header') {
          headers[serviceAuth.details['name']] = organizationAuth['value'].apiKeyValue;
        } else if (serviceAuth.details['in'] == 'query') {
          query[serviceAuth.details['name']] = organizationAuth['value'].apiKeyValue;
        }
      } else if ( serviceAuth.type == 'oauth1' ||
                serviceAuth.type == 'oauth2') {
        // oauth1 and oauth2 can have variables which are passed back when the user auths
        // and which should be forwarded into the input object.
        input = Object.assign(organizationAuth.value, input);
        if (serviceAuth.type == 'oauth1') {
          var oauth = {
            token: organizationAuth.value.oauthAccessToken,
            token_secret: organizationAuth.value.oauthAccessTokenSecret,
            consumer_key: organizationAuth.value.consumerKey,
            consumer_secret: organizationAuth.value.consumerSecret,
            verifier: organizationAuth.value.oauth_verifier
          }
        } else if (serviceAuth.type == 'oauth2') {
          var token = organizationAuth.value.access_token;
          if (serviceAuth.details.tokenLocation == 'bearer') {
            requestObject['auth'] = {
              bearer: token
            }
          } else if (serviceAuth.details.tokenLocation == 'header') {
            headers[serviceAuth.details.tokenFieldName] = token;
          } else if (serviceAuth.details.tokenLocation == 'query') {
            query[serviceAuth.details.tokenFieldName] = token;
          }

        }
      }
    }

    // input processing
    for (let actionInput of this.action['input']) {
      var fieldName = actionInput['name'];
      let value = input[fieldName];
      if (actionInput['default'] && !value) {
        value = actionInput['default'];
      }
      if (actionInput['required'] && !value) {
        throw new RequiredParameterMissingException(fieldName);
      }
      // unless a value is passed dont add it to anything
      if (!value) {
        continue;
      }
      if(actionInput['in'] == 'query') {
        query[fieldName] = value;
      } else if (actionInput['in'] == 'formData') {
        bodyInput[fieldName] = value;
      } else if (actionInput['in'] == 'body') {
        bodyInput[fieldName] = value;
      } else if (actionInput['in'] == 'path') {
        path = path.replace(`{${fieldName}}`, value)
      } else if (actionInput['in'] == 'host') {
        host = host.replace(`{${fieldName}}`, value)
      }
    }

    // merge input variables for path & host, might not need to do it above
    // because thats probably redundant. We need to do it here to merge variables
    // from service auth type configuration as well as inputs
    path = MergeVariables(path, input);
    host = MergeVariables(host, input);
    console.log('merged path & host', path, host);

    // build the request object
    // by default the body is equal to the input parsed into the specified content type
    // but if body_code_type is equal to javascript we run the javascript function to generate the request body.
    let requestBodyGenerator = new CodeRunner(this.organization, this.action.input_body.code, {input: bodyInput});
    body = bodyInput;
    if (this.action.input_body.content_type == 'text/plain') {
      headers['Content-Type'] == 'text/plain';
    } else if (this.action.input_body.content_type == 'json') {
      headers['Content-Type'] == 'application/json';
      if (this.action.input_body.body_code_type  == 'javascript') {
        body = await(requestBodyGenerator.run())
      }
      if (typeof body != 'string') {
        body = JSON.stringify(body);
      }
    } else if (this.action.input_body.content_type == 'xml') {
      headers['Content-Type'] == 'application/xml';
      if (this.action.input_body.body_code_type  == 'javascript') {
        body = await(requestBodyGenerator.run());
      }
      body = o2x(body);
    } else if (this.action.input_body.content_type == 'form') {
      headers['Content-Type'] == 'application/x-www-form-urlencoded';
      body = querystring.stringify(body);
    }

    // only send content-length if you're sending content.
    if (this.action['method'] != 'GET' && this.action['method'] != 'DELETE') {
      headers['Content-Length'] = body.length;
    }

    requestObject['method'] = this.action['method'];
    var joinedUrl = urljoin(host, path);
    var parsedUrl = url.parse(joinedUrl);
    requestObject['uri'] = url.format({
      protocol: parsedUrl.protocol,
      slashes: true,
      host: parsedUrl.host,
      pathname: parsedUrl.path,
      query: query,
      body: body
    })
    // todo : add more content types
    if (this.action.output_body.content_type == 'json') {
      headers['Accept'] = 'application/json';
    } else if (this.action.output_body.content_type == 'xml') {
      headers['Accept'] = 'application/xml';
    } else {
      headers['Accept'] = 'text/plain';
    }

    if (oauth) { requestObject['oauth'] = oauth; }
    requestObject['resolveWithFullResponse'] = true;
    requestObject['headers'] = headers;

		// run dynamic auths before the action is done.
    configurationParams = await(this.runCodeAuths(serviceAuths, organizationAuths, requestObject, input));
    requestObject.headers = Object.copy(headers, configurationParams.headers);

    let response = await(request(requestObject));

    var output = {};
    if (this.action.output_body.content_type == 'json') {
      output = JSON.parse(response.body)
    } else if (this.action.output_body.content_type == 'xml') {
      // todo: parse XML
      parser = new DOMParser();
      output = parser.parseFromString(response.body,"text/xml");
    }
    // output processing
    // by default, we parse the content type of the output into the resulting javascript object.
    // if body_code_type = javascript, we instead run a code function to map that result to
    // the result fields
    if (this.action.input_body.body_code_type  == 'javascript') {
      let outputParser = new CodeRunner(this.organization, this.action.output_body.code, {output: output});
      var parsedOutput = await(outputParser.run());
    } else {
      parsedOutput = output;
    }

    parsedOutput.statusCode = response.statusCode;
    return parsedOutput;
  }
}

module.exports = Request
