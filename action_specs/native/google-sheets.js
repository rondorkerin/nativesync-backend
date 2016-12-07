"use strict"
var async = require('async')
var await = require('await')
var Models = require('../../models');

async(() => {
	var sheets = await(Models.Service.upsert({name: 'GoogleSheets'}))


	await(Models.ServiceAuthSecret.upsert({service_auth_id: sheets.id, secret:
		{"web":{"client_id":"145857589614-4o4ntocion4b27sogf4nj1277d8g9sep.apps.googleusercontent.com","project_id":"avian-mile-145817","auth_uri":"https://accounts.google.com/o/oauth2/auth","token_uri":"https://accounts.google.com/o/oauth2/token","auth_provider_x509_cert_url":"https://www.googleapis.com/oauth2/v1/certs","client_secret":"Bq52IEs4O3kA6zYLWiHtzGxD"}}
	}))
	Action.create({
		service_id: nexternal.id,
		schemes: ['https'],
		headers: [{'Content Type': 'application/x-www-form-urlencoded'}],
		host: 'nexternal.com',
		path: '',
		method: 'POST',
		creator_user_id: 1,
		service_name: nexternal.name,
		function_name: 'getRecentOrders',
		type: 'rest',
		input_content_type: 'xml',
		output_content_type: 'xml',
		version: '1',
		description: 'a test action',
		input: [],
		output: [],
		official: true
	})

})()
