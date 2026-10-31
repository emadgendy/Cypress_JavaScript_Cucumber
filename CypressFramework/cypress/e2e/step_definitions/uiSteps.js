import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import AddProduct from '../../support/PageClass/AddProduct';
import Login from '../../support/PageClass/Login';
import Monitor from '../../support/PageClass/Monitor';
import SignUp from '../../support/PageClass/SignUp';

let signupAlert;
let loginAlert;
let uiStartTime;

function logUiPerformance(activity) {
  return cy.then(() => cy.logger('performance', `TotalTime taken to ${activity}: ${Date.now() - uiStartTime}ms`));
}

function loadUiTestData() {
  return cy.task('loadUiTestData');
}

When('I open the login form', () => {
  loginAlert = cy.stub();
  cy.on('window:alert', loginAlert);
  const login = new Login();
  login.clickLogin();
});

When('I enter the registered account credentials', () => {
  return loadUiTestData().then((data) => {
    const login = new Login();
    login.setUserName(data.account.username);
    login.setPassword(data.account.password);
  });
});

When('I submit the login form', () => {
  cy.intercept('POST', '**/login').as('loginRequest');
  new Login().clickLoginbtn();
  cy.wait('@loginRequest').its('response.statusCode').should('eq', 200);
  cy.logger('application', 'Entered login details');
});

When('I open the signup form', () => {
  const signup = new SignUp();
  signupAlert = cy.stub();
  cy.on('window:alert', signupAlert);
  signup.clickSignUp();
});

Given('I open the DemoBlaze application', () => {
  uiStartTime = Date.now();
  cy.visit('https://www.demoblaze.com/');
  cy.logger('application', 'Launched Application');
});

Then("the registered user's welcome message is displayed", () => {
  return loadUiTestData()
    .then((data) => cy.wrap(loginAlert)
      .should('not.have.been.called')
      .then(() => new Login().verifyLoginSuccessMsg(data.account.welcomeMessage)))
    .then(() => logUiPerformance('LoginUser'));
});

When('I enter a unique signup username and registered password', () => {
  return loadUiTestData().then((data) => {
    const signup = new SignUp();
    signup.setUserName(`${data.account.username}${Date.now()}`);
    signup.setPassword(data.account.password);
    cy.logger('application', 'Entered User details-->SignUp Test');
  });
});

When('I enter the registered signup credentials', () => {
  return loadUiTestData().then((data) => {
    const signup = new SignUp();
    signup.setUserName(data.account.username);
    signup.setPassword(data.account.password);
  });
});

When('I submit the signup form', () => {
  cy.intercept('POST', '**/signup').as('signupRequest');
  new SignUp().clickSubmit();
  cy.wait('@signupRequest');
});

Then('the signup alert contains {string}', (expectedMessage) => {
  return cy.wrap(signupAlert).should('have.been.calledWith', expectedMessage).then(() => {
    cy.logger('application', 'Verified User SignUp-->SignUp Test');
    return logUiPerformance('registerUser');
  });
});

When('I submit the signup form without credentials', () => {
  new SignUp().clickSubmit();
});

When('I open the monitor category', () => {
  new Monitor().isMonitorDisplayed();
});

Then('both expected monitors and prices are displayed', () => {
  return loadUiTestData().then((data) => {
    const monitor = new Monitor();
    monitor.ValidateMonitor1(data.monitor.first.name);
    monitor.Validatemonitor1Price(data.monitor.first.price);
    monitor.ValidateMonitor2(data.monitor.second.name);
    monitor.Validatemonitor2Price(data.monitor.second.price);
  }).then(() => logUiPerformance("ValidateMonitor's"));
});

When('I add the sample phone to the cart and place the order', () => {
  cy.viewport(1920, 1080);
  new AddProduct().addProduct();
});

When('I submit the sample shipping details', () => {
  return loadUiTestData().then((data) => {
    const product = new AddProduct();
    product.enterName(data.product.name);
    product.entercountry(data.product.country);
    product.entercity(data.product.city);
    product.entercard(data.product.creditCard);
    product.entermonth(data.product.month);
    product.enteryear(data.product.year);
    product.clickPurchase();
  });
});

Then('the order is confirmed', () => {
  return cy.then(() => new AddProduct().validateOrder())
    .then(() => logUiPerformance('Purchase Product'));
});
