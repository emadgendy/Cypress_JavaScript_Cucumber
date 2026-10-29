import BasePage from './BasePage';

class SignUp extends BasePage {
  registerbtn = '#signin2';
  txtusername = '#sign-username';
  txtpassword = '#sign-password';
  signUpbtn = '#signInModal button.btn-primary';

  clickSignUp() {
    this.clickElement(this.registerbtn);
    this.assertVisible('#signInModal h5');
  }

  setUserName(username) {
    this.typeText(this.txtusername, username);
  }

  setPassword(password) {
    this.typeText(this.txtpassword, password);
  }

  clickSubmit() {
    this.clickElement(this.signUpbtn);
  }

  verifySuccessMsg(successMsg) {
    cy.on('window:alert', (message) => {
      expect(message).to.contain(successMsg);
    });
  }

  verifyUserexist(userExistMsg) {
    cy.on('window:alert', (message) => {
      expect(message).to.contain(userExistMsg);
    });
  }

  verifyInvalidData(invalidDataMsg) {
    cy.on('window:alert', (message) => {
      expect(message).to.contain(invalidDataMsg);
    });
  }
}

export default SignUp;