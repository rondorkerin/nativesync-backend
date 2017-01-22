'use strict';

var async = require('asyncawait/async');
var await = require('asyncawait/await');
let postgres = require('../drivers/postgres');
let Sequelize = require('sequelize');
var IntegrationRequest = postgres.define('integration_request', {
  id: {
    type: Sequelize.BIGINT,
    autoIncrement: true,
    primaryKey: true
  },
  organization_id: {
    type: Sequelize.BIGINT
  },
  assigned_organization_id: {
    type: Sequelize.BIGINT
  },
  integration_id: {
    type: Sequelize.BIGINT
  },
  contact_name: {
    type: Sequelize.STRING
  },
  contact_phone: {
    type: Sequelize.STRING
  },
  contact_email: {
    type: Sequelize.STRING
  },
  cost: {
    type: Sequelize.FLOAT
  },
  paid: {
    type: Sequelize.BOOLEAN
  },
  type: {
    type: Sequelize.STRING
  },
  jobStatus: {
    type: Sequelize.STRING
  },
  services: {
    type: Sequelize.JSON
  },
  steps: {
    type: Sequelize.JSON
  },
  consultantLevel: {
    type: Sequelize.STRING
  },
  newServices: {
    type: Sequelize.JSON
  },
  discount: {
    type: Sequelize.FLOAT
  },
  discountCode: {
    type: Sequelize.STRING
  },
  details: {
    type: Sequelize.TEXT
  },
  createdAt: {
    type: Sequelize.DATE
  },
  updatedAt: {
    type: Sequelize.DATE
  },
}, {
  indexes: [{fields: ['organization_id']}, {fields: ['assigned_organization_id']}],
  freezeTableName: true
});

IntegrationRequest.getPricing = async((integrationRequest) => {
  // custom integration requests are the only ones that cost money.
  // the other type: 'implement' is typically free.
  if (integrationRequest.type != 'custom') {
    return integrationRequest;
  }
  if (integrationRequest.discountCode) {
    var organization = await(Models.Organization.findOne({where: {discountCode: integrationRequest.discountCode}}));
    if (organization) {
      integrationRequest.discount = 0.3;
    }
  }

  var consultantRates = {
    bronze: 25, silver: 50, gold: 75, platinum: 100, diamond: 125
  }
  var testingHoursPerStep = 2.0;
  var hoursPerStep = 5.0;
  var hoursPerExistingService = 5.0;
  var hoursPerNewService = 10.0;

  var consultingRate = consultantRates[integrationRequest.consultantLevel];
  var numSteps = integrationRequest.steps.length
  var stepsCost = numSteps * hoursPerStep;
  var numExistingServices = integrationRequest.services.length;
  var existingServicesCost = numExistingServices * hoursPerExistingService;
  var numNewServices = integrationRequest.newServices.length
  var newServicesCost = numNewServices * hoursPerNewService;
  var testingHours = numSteps * testingHoursPerStep;
  var redeemedDiscount = integrationRequest.discount;
  var subtotal = consultingRate * (stepsCost + existingServicesCost + newServicesCost + testingHours)
  var totalCost = subtotal * (1 - redeemedDiscount);
  integrationRequest.cost = totalCost;

  return integrationRequest;
})

module.exports = IntegrationRequest;
