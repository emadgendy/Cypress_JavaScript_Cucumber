Feature: Purchase a product

  Background:
    Given I open the DemoBlaze application

  Scenario: Complete a purchase
    When I log in with the registered account
    And I add the sample phone to the cart and place the order
    And I submit the sample shipping details
    Then the order is confirmed
