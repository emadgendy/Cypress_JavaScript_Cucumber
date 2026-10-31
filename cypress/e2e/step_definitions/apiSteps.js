import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import { Faker, en } from '@faker-js/faker';
import { JSONPath } from 'jsonpath-plus';
import {
  createProduct,
  deleteProduct,
  getproducts,
  getproductswithouttoken,
  login,
  updateProduct,
  updateProductwithoutToken,
} from '../../support/apiUtils';

const faker = new Faker({ locale: [en] });
const loginUser = require('../../support/TestData/loginuser.json');
let response;
let accessToken;
let payload;

When('I authenticate with valid API credentials', () => {
  login(loginUser.email, loginUser.password).then((result) => {
    response = result.response;
    accessToken = result.access_token;
  });
});

When('I authenticate with an incorrect email', () => {
  login(loginUser.incorrectemail, loginUser.password).then((result) => {
    response = result.response;
  });
});

Then('the API responds with status {int} and an access token', (status) => {
  expect(response.status).to.eq(status);
  expect(response.body).to.have.property('access_token').that.is.not.empty;
  cy.logger('apitest', `Validated API login response with status ${status}`);
});

Then('the API responds with status {int}', (status) => {
  expect(response.status).to.eq(status);
  cy.logger('apitest', `Validated API response with status ${status}`);
});

Then('the API error message is {string}', (message) => {
  expect(response.body.message).to.eq(message);
  cy.logger('apitest', `Validated API error: ${message}`);
});

Given('I have generated product data', () => {
  payload = {
    name: faker.commerce.productName(),
    cost: faker.number.int({ min: 100, max: 90000 }),
    quantity: faker.number.int({ min: 100, max: 500 }),
    locationId: faker.number.int({ min: 1, max: 5 }),
    DealerId: faker.number.int({ min: 1, max: 5 }),
  };
});

When('I request the product list with the access token', () => {
  getproducts(accessToken).then((result) => { response = result; });
});

When('I request the product list with a revoked token', function () {
  const revokedToken = Cypress.env('API_REVOKED_TOKEN') || loginUser.revokedtoken;
  if (!revokedToken || revokedToken.includes('*')) {
    this.skip();
  }
  getproducts(revokedToken).then((result) => { response = result; });
});

When('I request the product list without a token', () => {
  getproductswithouttoken().then((result) => { response = result; });
});

Then('the product response status is {int}', (status) => {
  expect(response.status).to.eq(status);
});

Then('the product list contains the expected devices', () => {
  const productNames = JSONPath({ path: '$..name', json: response.body })
    .map((name) => name.trim());
  expect(productNames).to.include.members([
    'Redmi 11 Prime 5G',
    'Samsung Galaxy M33 5G',
  ]);
  cy.logger('apitest', 'Validated expected devices in product response');
});

Then('the first product cost and Samsung Galaxy M33 are correct', () => {
  const firstProductCost = JSONPath({ path: '$.[0].cost', json: response.body });
  const productNames = JSONPath({ path: '$..name', json: response.body })
    .map((name) => name.trim());
  expect(response.body).to.be.an('array').that.is.not.empty;
  expect(productNames).to.include('Samsung Galaxy M33 5G');
  const cost = Number(firstProductCost[0]);
  expect(Number.isFinite(cost)).to.eq(true);
  expect(cost).to.be.greaterThan(0);
  cy.logger('apitest', 'Validated product names and cost in response');
});

When('I create the product with the access token', () => {
  createProduct(payload, accessToken).then((result) => { response = result; });
});

When('I create and delete the product with the access token', () => {
  createProduct(payload, accessToken).then((createdProduct) => {
    expect(createdProduct.status).to.eq(201);
    return deleteProduct(accessToken, createdProduct.body.id);
  }).then((result) => { response = result; });
});

Then('the created product matches the generated data', () => {
  expect(response.body.name).to.eq(payload.name);
  cy.logger('apitest', 'Validated newly created product');
});

When('I update product {int} with the access token', (id) => {
  updateProduct(payload, accessToken, id).then((result) => { response = result; });
});

Then('the updated product quantity matches the generated data', () => {
  expect(response.body.quantity).to.eq(payload.quantity);
  cy.logger('apitest', 'Validated updated product quantity');
});

When('I update product {int} without a token', (id) => {
  cy.wait(2500);
  updateProductwithoutToken(payload, id).then((result) => { response = result; });
});

When('I update product {int} with a revoked token', function (id) {
  const revokedToken = Cypress.env('API_REVOKED_TOKEN') || loginUser.revokedtoken;
  if (!revokedToken || revokedToken.includes('*')) {
    this.skip();
  }
  updateProduct(payload, revokedToken, id).then((result) => { response = result; });
});

When('I delete product {int} with the access token', (id) => {
  deleteProduct(accessToken, id).then((result) => { response = result; });
});
