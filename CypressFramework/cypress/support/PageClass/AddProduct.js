import BasePage from './BasePage';

class AddProduct extends BasePage {
  phonesbtn = '[onclick="byCat(\'phone\')"]';
  mobile = '.card-title a';
  price = '#tbodyid h3';
  addtoCart = 'a[onclick^="addToCart"]';
  cart = '#cartur';
  totalprice = '#totalp';
  placeOrder = '#page-wrapper button.btn-success';
  name = '#name';
  country = '#country';
  city = '#city';
  card = '#card';
  month = '#month';
  year = '#year';
  purchasebtn = '#orderModal button.btn-primary';
  thankmsg = '.sweet-alert h2';
  orderdetails = '.sweet-alert p.lead';
  okbtn = '.sweet-alert button.confirm';
  logout = '#logout2';
  login = '#login2';

  addProduct() {
    this.clickElement(this.phonesbtn);
    this.clickElement(this.mobile, 'Samsung galaxy s6');
    this.assertText(this.price, '$360 *includes tax');
    cy.intercept('POST', '**/addtocart').as('addProductToCart');
    this.clickElement(this.addtoCart);
    cy.wait('@addProductToCart');
    cy.intercept('POST', '**/viewcart').as('loadCart');
    this.clickElement(this.cart);
    cy.wait('@loadCart');
    cy.contains('#tbodyid tr', 'Samsung galaxy s6').should('contain.text', '360');
    cy.get(this.totalprice).invoke('text').then((total) => {
      expect(Number(total)).to.be.greaterThan(0);
    });
    cy.wait(2500);
    cy.get('#page-wrapper').screenshot();
    this.clickElement(this.placeOrder);
    cy.logger('application', 'Product Added to Cart and Placed Order');
  }

  enterName(data) {
    this.typeText(this.name, data);
  }

  entercountry(data) {
    this.typeText(this.country, data);
  }

  entercity(data) {
    this.typeText(this.city, data);
  }

  entercard(data) {
    this.typeText(this.card, data);
  }

  entermonth(data) {
    this.typeText(this.month, data);
  }

  enteryear(data) {
    this.typeText(this.year, data);
    cy.get('#page-wrapper').screenshot();
  }

  clickPurchase() {
    this.clickElement(this.purchasebtn);
    cy.logger('application', 'User detaile entered & Clicked On Purchased');
  }

  validateOrder() {
    this.assertText(this.thankmsg, 'Thank you for your purchase!');
    cy.get(this.orderdetails).then(($value) => {
      const orderid = $value.text();
      cy.logger('application', `Order Id :${orderid}`);
    });
    cy.get(this.orderdetails).screenshot('OrderPurchased');
    this.clickElement(this.okbtn);
    this.clickElement(this.logout);
    this.assertText(this.login, 'Log in');
    cy.logger('application', 'Validated Order & Logout');
  }
}

export default AddProduct;