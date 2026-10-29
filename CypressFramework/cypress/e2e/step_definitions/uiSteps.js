import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import AddProduct from '../../PageClass/AddProduct';
import Login from '../../PageClass/Login';
import Monitor from '../../PageClass/Monitor';
import SignUp from '../../PageClass/SignUp';

let signupAlert;
let uiStartTime;

Given('I open the DemoBlaze application', () => {
  uiStartTime = Date.now();
  cy.visit('https://www.demoblaze.com/');
  cy.logger('application', 'Launched Application');
});

When('I log in with the registered account', () => {
  cy.fixture('Testdata').then((data) => {
    const login = new Login();
    login.clickLogin();
    login.setUserName(data.UserName);
    login.setPassword(data.UserPassword);
    cy.logger('application', 'Entered login details');
    login.clickLoginbtn();
  });
});

Then("the registered user's welcome message is displayed", () => {
  cy.fixture('Testdata').then((data) => {
    new Login().verifyLoginSuccessMsg(data.loginmsg);
  }).then(() => {
    cy.logger('performance', `TotalTime taken to LoginUser: ${Date.now() - uiStartTime}ms`);
  });
});

When('I register with a unique username', () => {
  cy.fixture('Testdata').then((data) => {
    const signup = new SignUp();
    signupAlert = undefined;
    cy.on('window:alert', (message) => { signupAlert = message; });
    signup.clickSignUp();
    signup.setUserName(`${data.UserName}${Math.floor(Math.random() * 101)}`);
    signup.setPassword(data.UserPassword);
    signup.clickSubmit();
  });
});

When('I register with the existing account', () => {
  cy.fixture('Testdata').then((data) => {
    const signup = new SignUp();
    signupAlert = undefined;
    cy.on('window:alert', (message) => { signupAlert = message; });
    signup.clickSignUp();
    signup.setUserName(data.UserName);
    signup.setPassword(data.UserPassword);
    signup.clickSubmit();
  });
});

When('I submit signup without credentials', () => {
  const signup = new SignUp();
  signupAlert = undefined;
  cy.on('window:alert', (message) => { signupAlert = message; });
  signup.clickSignUp();
  signup.clickSubmit();
});

Then('the signup alert contains {string}', (expectedMessage) => {
  cy.then(() => {
    expect(signupAlert).to.contain(expectedMessage);
    cy.logger('performance', `TotalTime taken to registerUser: ${Date.now() - uiStartTime}ms`);
  });
});

When('I open the monitor category', () => {
  cy.fixture('monitor').then((data) => {
    const monitor = new Monitor();
    monitor.isMonitorDisplayed();
    monitor.ValidateMonitor1(data.monitor1);
    monitor.Validatemonitor1Price(data.m1Price);
    monitor.ValidateMonitor2(data.monitor2);
    monitor.Validatemonitor2Price(data.m2Price);
  });
});

Then('both expected monitors and prices are displayed', () => {
  cy.fixture('monitor').then((data) => {
    const monitor = new Monitor();
    monitor.ValidateMonitor1(data.monitor1);
    monitor.Validatemonitor1Price(data.m1Price);
    monitor.ValidateMonitor2(data.monitor2);
    monitor.Validatemonitor2Price(data.m2Price);
  }).then(() => {
    cy.logger('performance', `TotalTime taken to ValidateMonitor's: ${Date.now() - uiStartTime}ms`);
  });
});

When('I add the sample phone to the cart and place the order', () => {
  cy.viewport(1920, 1080);
  new AddProduct().addProduct();
});

When('I submit the sample shipping details', () => {
  cy.fixture('product').then((data) => {
    const product = new AddProduct();
    product.enterName(data.name);
    product.entercountry(data.Country);
    product.entercity(data.City);
    product.entercard(data.Creditcard);
    product.entermonth(data.Month);
    product.enteryear(data.Year);
    product.clickPurchase();
  });
});

Then('the order is confirmed', () => {
  new AddProduct().validateOrder();
  cy.then(() => cy.logger('performance', `TotalTime taken to Purchase Product: ${Date.now() - uiStartTime}ms`));
});
