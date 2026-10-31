Feature: Purchase a product

  Background:
    Given I open the DemoBlaze application

  Scenario: Complete a purchase
    When I click on "SignUp.navigation" button
    And I enter a unique signup username and registered password
    And I click on "SignUp.form" button
    Then the signup alert contains "Sign up successful."
    When I click on "Login.navigation" button
    And I enter the registered account credentials
    And I click on "Login.form" button
    Then the registered user's welcome message is displayed
    When I click on "AddProduct.category" link
    And I click on "AddProduct.product" link
    Then the sample phone price is displayed
    When I click on "AddProduct.addToCart" link
    Then the sample phone is added to the cart
    When I click on "AddProduct.cart" link
    Then the cart contains the sample phone
    When I click on "AddProduct.placeOrder" button
    And I submit the sample shipping details
    And I click on "AddProduct.purchase" button
    Then the order is confirmed
    When I click on "AddProduct.confirmation" button
    And I click on "AddProduct.navigation" link
    Then the user is logged out
