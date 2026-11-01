import { Given, When, Then } from '@badeball/cypress-cucumber-preprocessor';
import AddProduct from '../../support/PageClass/AddProduct';
import Login from '../../support/PageClass/Login';
import Monitor from '../../support/PageClass/Monitor';
import SignUp from '../../support/PageClass/SignUp';

const loginPage = new Login();
const signUpPage = new SignUp();
const monitorPage = new Monitor();
const productPage = new AddProduct();
const pageObjects = {
  Login: loginPage,
  SignUp: signUpPage,
  Monitor: monitorPage,
  AddProduct: productPage,
};
const pages = {
  Login: {
    welcomemsg: loginPage.welcomemsg,
    requestStatus: () => cy.wait('@loginRequest')
      .its('response.statusCode')
      .then(String),
    alert: () => cy.wrap(loginAlert)
      .then(() => (loginAlert.called ? loginAlert.lastCall.args[0] : '')),
    navigation: {
      loginButton: loginPage.loginbtn,
    },
    form: {
      signInButton: loginPage.signInbtn,
    },
  },
  SignUp: {
    alert: () => cy.wrap(signupAlert)
      .should('have.been.called')
      .then(() => signupAlert.lastCall.args[0]),
    navigation: {
      signUpButton: signUpPage.registerbtn,
    },
    form: {
      submitButton: signUpPage.signUpbtn,
    },
  },
  Monitor: {
    monitor1: '.card-title a:eq(0)',
    monitor2: '.card-title a:eq(1)',
    m1price: '.card-block h5:eq(0)',
    m2price: '.card-block h5:eq(1)',
    category: {
      monitorButton: monitorPage.monitorbtn,
    },
  },
  AddProduct: {
    price: productPage.price,
    cartProduct: '#tbodyid tr',
    totalprice: productPage.totalprice,
    thankmsg: productPage.thankmsg,
    login: productPage.login,
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

When(/^I enter value (.+) in "([^"]+)"$/, (value, pageElement) => {
  const [pageName, elementProperty, ...extraParts] = pageElement.trim().split(/\s+/);
  const propertyName = elementProperty?.replace(/^\./, '');
  const selector = extraParts.length === 0 && propertyName
    ? pageObjects[pageName]?.[propertyName]
    : undefined;

  if (typeof selector !== 'string') {
    throw new Error(`Page element not found: ${pageElement}`);
  }
  return cy.get(selector)
    .should('be.visible')
    .clear()
    .type(value);
});

Then('I see {string} text to {word} {string}', (pageElement, assertionType, expectedValue) => {
  const [pageName, elementName] = pageElement.split('.');
  const element = pages[pageName]?.[elementName];

  if (!element) {
    throw new Error(`Element not found: ${pageElement}`);
  }

  const assertion = {
    equal: 'eq',
    contain: 'include',
  }[assertionType];
  if (!assertion) {
    throw new Error(`Unsupported assertion type: ${assertionType}`);
  }

  const text = typeof element === 'function'
    ? element()
    : cy.get(element)
      .should('be.visible')
      .invoke('text')
      .then((value) => value.trim());

  return text.should(assertion, expectedValue);
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
      username: Date.now().toString(36),
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
  signupAlert = cy.stub();
  loginAlert = cy.stub();
  activeAlert = null;
  testAccount = null;
  cy.on('window:alert', (message) => {
    if (activeAlert) {
      activeAlert(message);
    }
  });
  cy.visit('https://www.demoblaze.com/');
  cy.intercept('POST', '**/login').as('loginRequest');
  cy.intercept('POST', '**/bycat').as('loadCategory');
  cy.intercept('POST', '**/addtocart').as('addProductToCart');
  cy.intercept('POST', '**/viewcart').as('loadCart');
  cy.logger('application', 'Launched Application');
});

When('I enter the registered signup credentials', () => {
  activeAlert = signupAlert;
  return loadUiTestData().then((data) => {
    const signup = new SignUp();
    signup.setUserName(data.account.username);
    signup.setPassword(data.account.password);
  });
});

When('I record UI performance for {string}', (activity) => {
  return logUiPerformance(activity);
});

When('the sample phone add-to-cart request completes', () => {
  cy.wait('@addProductToCart');
});

When('the cart request completes', () => {
  cy.wait('@loadCart');
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

When('I log the order details', () => {
  return cy.get(productPage.orderdetails).then(($value) => {
    cy.logger('application', `Order Id :${$value.text()}`);
  })
    .then(() => cy.get(productPage.orderdetails).screenshot('OrderPurchased'))
    .then(() => logUiPerformance('Purchase Product'));
});
