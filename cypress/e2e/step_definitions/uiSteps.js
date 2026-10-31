import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import AddProduct from '../../support/PageClass/AddProduct';
import Login from '../../support/PageClass/Login';
import Monitor from '../../support/PageClass/Monitor';
import SignUp from '../../support/PageClass/SignUp';

const loginPage = new Login();
const signUpPage = new SignUp();
const monitorPage = new Monitor();
const productPage = new AddProduct();
const pages = {
  Login: {
    navigation: {
      loginButton: loginPage.loginbtn,
    },
    form: {
      signInButton: loginPage.signInbtn,
    },
  },
  SignUp: {
    navigation: {
      signUpButton: signUpPage.registerbtn,
    },
    form: {
      submitButton: signUpPage.signUpbtn,
    },
  },
  Monitor: {
    category: {
      monitorButton: monitorPage.monitorbtn,
    },
  },
  AddProduct: {
    category: {
      phoneLink: productPage.phonesbtn,
    },
    product: {
      samplePhoneLink: '.card-title a:contains("Samsung galaxy s6")',
    },
    addToCart: {
      addToCartLink: productPage.addtoCart,
    },
    cart: {
      cartLink: productPage.cart,
    },
    placeOrder: {
      placeOrderButton: productPage.placeOrder,
    },
    purchase: {
      purchaseButton: productPage.purchasebtn,
    },
    confirmation: {
      confirmationButton: productPage.okbtn,
    },
    navigation: {
      logoutLink: productPage.logout,
    },
  },
};

let signupAlert;
let loginAlert;
let activeAlert;
let testAccount;
let uiStartTime;

When('I click on {string} {word}', (pagePath, elementType) => {
  const [pageName, propertyName] = pagePath.split('.');
  const pageElements = pages[pageName]?.[propertyName];

  if (!pageElements) {
    throw new Error(`Page element not found: ${pagePath}`);
  }

  const elementName = Object.keys(pageElements).find((key) => (
    elementType.toLowerCase() === 'button'
      ? key.toLowerCase().includes('button')
      : !key.toLowerCase().includes('button')
  ));

  if (!elementName) {
    throw new Error(`No ${elementType} found in ${pagePath}`);
  }

  const element = cy.get(pageElements[elementName]).should('be.visible');
  const click = elementType.toLowerCase() === 'button'
    ? element.then(($element) => {
        expect($element).not.to.be.disabled;
      }).click()
    : element.click();

  if (pageName === 'SignUp') {
    activeAlert = signupAlert;
  } else if (pageName === 'Login') {
    activeAlert = loginAlert;
  }

  if ((pageName === 'AddProduct' || pageName === 'Monitor')
    && propertyName === 'category') {
    return click
      .then(() => cy.wait('@loadCategory'))
      .then(() => cy.get('.card-title a').should('be.visible'));
  }

  return click;
});

function logUiPerformance(activity) {
  return cy.then(() => cy.logger('performance', `TotalTime taken to ${activity}: ${Date.now() - uiStartTime}ms`));
}

function loadUiTestData() {
  return cy.task('loadUiTestData');
}

When('I enter the registered account credentials', () => {
  if (!testAccount) {
    throw new Error('Create a test account before entering login credentials');
  }
  const login = new Login();
  login.setUserName(testAccount.username);
  login.setPassword(testAccount.password);
});

When('I enter a unique signup username and registered password', () => {
  return loadUiTestData().then((data) => {
    testAccount = {
      username: Date.now().toString(36).slice(-4),
      password: data.account.password,
    };
    const signup = new SignUp();
    signup.setUserName(testAccount.username);
    signup.setPassword(testAccount.password);
    cy.logger('application', 'Entered User details-->SignUp Test');
  });
});

Given('I open the DemoBlaze application', () => {
  uiStartTime = Date.now();
  loginAlert = cy.stub();
  signupAlert = cy.stub();
  activeAlert = null;
  testAccount = null;
  cy.on('window:alert', (message) => {
    if (activeAlert) {
      activeAlert(message);
    }
  });
  cy.visit('https://www.demoblaze.com/');
  cy.intercept('POST', '**/login').as('loginRequest');
  cy.intercept('POST', '**/signup').as('signupRequest');
  cy.intercept('POST', '**/bycat').as('loadCategory');
  cy.intercept('POST', '**/addtocart').as('addProductToCart');
  cy.intercept('POST', '**/viewcart').as('loadCart');
  cy.logger('application', 'Launched Application');
});

Then("the registered user's welcome message is displayed", () => {
  return cy.wait('@loginRequest')
    .its('response.statusCode')
    .should('eq', 200)
    .then(() => cy.wrap(loginAlert)
      .should('not.have.been.called')
      .then(() => cy.get(loginPage.welcomemsg).should('contain.text', 'Welcome')))
    .then(() => logUiPerformance('LoginUser'));
});

When('I enter the registered signup credentials', () => {
  activeAlert = signupAlert;
  return loadUiTestData().then((data) => {
    const signup = new SignUp();
    signup.setUserName(data.account.username);
    signup.setPassword(data.account.password);
  });
});

Then('the signup alert contains {string}', (expectedMessage) => {
  const alertCheck = () => cy.wrap(signupAlert)
    .should('have.been.calledWith', expectedMessage);
  const request = expectedMessage === 'Please fill out Username and Password.'
    ? cy.then(alertCheck)
    : cy.wait('@signupRequest').then(alertCheck);

  return request.then(() => {
    cy.logger('application', 'Verified User SignUp-->SignUp Test');
    return logUiPerformance('registerUser');
  });
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

Then('the sample phone price is displayed', () => {
  cy.get(productPage.price).should('have.text', '$360 *includes tax');
});

Then('the sample phone is added to the cart', () => {
  cy.wait('@addProductToCart');
});

Then('the cart contains the sample phone', () => {
  return cy.wait('@loadCart').then(() => {
    cy.contains('#tbodyid tr', 'Samsung galaxy s6').should('contain.text', '360');
    cy.get(productPage.totalprice).invoke('text').then((total) => {
      expect(Number(total)).to.be.greaterThan(0);
    });
  });
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
  });
});

Then('the order is confirmed', () => {
  return cy.get(productPage.thankmsg)
    .should('have.text', 'Thank you for your purchase!')
    .then(() => cy.get(productPage.orderdetails).then(($value) => {
      cy.logger('application', `Order Id :${$value.text()}`);
    }))
    .then(() => cy.get(productPage.orderdetails).screenshot('OrderPurchased'))
    .then(() => logUiPerformance('Purchase Product'));
});

Then('the user is logged out', () => {
  cy.get(productPage.login).should('have.text', 'Log in');
});
