import BasePage from './BasePage';

class Login extends BasePage {
  loginbtn = '#login2';
  usernametxt = '#loginusername';
  passwordtxt = '#loginpassword';
  signInbtn = '#logInModal button.btn-primary';
  welcomemsg = '#nameofuser';

  clickLogin() {
    this.clickElement(this.loginbtn);
    this.assertVisible('#logInModal h5');
  }

  setUserName(username) {
    this.typeText(this.usernametxt, username);
  }

  setPassword(password) {
    this.typeText(this.passwordtxt, password);
  }

  clickLoginbtn() {
    this.clickElement(this.signInbtn);
  }

  verifyLoginSuccessMsg(successMsg) {
    cy.get(this.welcomemsg).should('contain.text', successMsg);
  }
}

export default Login;