'use strict';
var test = require('tape');
var Action = require('../models/action')
var async = require('asyncawait/async')
var await = require('asyncawait/await')

test('ip_api', async(function (t) {
    t.plan(1);
    var input = {ip: '200.1.1.1'}
    let action = await(Action.findOne({where: {function_name: 'IP Location Lookup'}}))
    let Request = require('../services/request')
    var output = new Request(1, action).send(input)
    debugger;
    t.equal(output['status'], 'success');
}));
