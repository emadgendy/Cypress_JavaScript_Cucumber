Feature: Purchase a product

  Background:
    Given I open the DemoBlaze application

  Scenario: Complete a purchase
    When I open the login form
    And I enter the registered account credentials
    And I submit the login form
    And I add the sample phone to the cart and place the order
    And I submit the sample shipping details
    Then the order is confirmed
