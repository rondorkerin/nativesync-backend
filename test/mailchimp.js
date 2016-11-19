'use strict';
var test = require('tape');
var Models = require('../models');
var Service = Models['Service'];
var ServiceAuth = Models['ServiceAuth'];
var Action = Models['Action'];
var ClientAuth = Models['ClientAuth'];
var async = require('asyncawait/async')
var await = require('asyncawait/await')
let Partner = Models['Partner'];
let Client = Models['Client'];

test('mailchimp', async(function (t) {
    t.plan(1);
    var input = {}
    await(Partner.upsert({name: 'test'}));
    let partner = await(Partner.findOne({where: {name: 'test'}}));
    await(Client.upsert({partner_id: partner.id, name: 'test', api_key: 'a'}));
    let client = await(Client.findOne({where: {api_key: 'a'}}))
    let service = await(Service.findOne({where: {name: 'Mailchimp'}}))
    let service_auth = await(service.getServiceAuths({where: {name: 'Basic Auth'}}))[0];
    let client_auth = await(ClientAuth.upsert({client_id: client.id, service_id: service.id, service_auth_id: service_auth.id, value: {username: 'sbryant31@gmail.com', password: '342afea1a8aef1fbb512b4aed1bedc46-us12'}}));
    // add client configuration for datacenter
    service_auth = await(service.getServiceAuths({where: {name: 'Datacenter'}}))[0];
    client_auth = await(ClientAuth.upsert({client_id: client.id, service_id: service.id, service_auth_id: service_auth.id, value: {'data-center': 'us12'}}));
    let action = await(Action.findOne({where: {function_name: 'Get lists', service_id: service.id}}))
    let Request = require('../services/request')
    var output = new Request(client.id, action).send(input)
    t.equal(output['status'], 'success');
}));
