'use strict';
var test = require('tape');
var Service = require('../models/service')
var ServiceAuth = require('../models/service_auth')
var Action = require('../models/action')
var ClientAuth = require('../models/client_auth')
var async = require('asyncawait/async')
var await = require('asyncawait/await')
let Partner = require('../models/partner');
let Client = require('../models/client');

test('ip_api', async(function (t) {
    t.plan(1);
    var input = {}
    await(Partner.upsert({name: 'test'}));
    let partner = await(Partner.findOne({where: {name: 'test'}}));
    await(Client.upsert({partner_id: partner.id, name: 'test', api_key: 'a'}));
    let client = await(Client.findOne({where: {api_key: 'a'}}))
    let service = await(Service.findOne({where: {name: 'Mailchimp'}}))
    let service_auth = await(service.getServiceAuths())[0];
    debugger;
    let client_auth = await(ClientAuth.upsert({client_id: client.id, service_id: service.id, service_auth_id: service_auth.id, value: {username: 'sbryant31@gmail.com', password: 'test'}}));
    let action = await(Action.findOne({where: {function_name: 'IP Location Lookup'}}))
    let Request = require('../services/request')
    var output = new Request(action).send(input)
    debugger;
    t.equal(output['status'], 'success');
}));
