class BasePage {
  getElement(elm, text) {
    const elements = cy.get(elm);
    return text === undefined
      ? elements
      : elements.filter((_, element) => element.textContent.trim() === text);
  }

  clickElement(elm, text) {
    this.getElement(elm, text).click();
  }

  typeText(elm, value) {
    cy.get(elm).clear().type(value);
  }

  assertText(elm, expectedText) {
    this.getElement(elm, expectedText).should('have.text', expectedText);
  }

  assertVisible(elm, text) {
    this.getElement(elm, text).should('be.visible');
  }
}

export default BasePage;
