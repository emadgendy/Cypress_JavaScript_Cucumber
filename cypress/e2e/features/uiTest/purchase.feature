Feature: Purchase a product

  Background:
    Given I open the DemoBlaze application

  Scenario: Complete a purchase
    When I click on "SignUp.navigation" button
    And I enter a unique signup username and registered password
    And I click on "SignUp.form" button
    Then I see "SignUp.alert" text to equal "Sign up successful."
    And I record UI performance for "registerUser"
    When I click on "Login.navigation" button
    And I enter the registered account credentials
    And I click on "Login.form" button
    Then I see "Login.requestStatus" text to equal "200"
    And I see "Login.alert" text to equal ""
    Then I see "Login.welcomemsg" text to contain "Welcome"
    And I record UI performance for "LoginUser"
    When I click on "AddProduct.category" link
    And I click on "AddProduct.product" link
    Then I see "AddProduct.price" text to equal "$360 *includes tax"
    When I click on "AddProduct.addToCart" link
    And the sample phone add-to-cart request completes
    When I click on "AddProduct.cart" link
    And the cart request completes
    Then I see "AddProduct.cartProduct" text to contain "Samsung galaxy s6"
    And I see "AddProduct.totalprice" text to equal "360"
    When I click on "AddProduct.placeOrder" button
    And I enter value JackSon in "AddProduct .name"
    And I enter value Russia in "AddProduct .country"
    And I enter value Moscow in "AddProduct .city"
    And I enter value 8173239123 in "AddProduct .card"
    And I enter value 12 in "AddProduct .month"
    And I enter value 2028 in "AddProduct .year"
    And I click on "AddProduct.purchase" button
    Then I see "AddProduct.thankmsg" text to equal "Thank you for your purchase!"
    When I log the order details
    When I click on "AddProduct.confirmation" button
    And I click on "AddProduct.navigation" link
    Then I see "AddProduct.login" text to equal "Log in"
