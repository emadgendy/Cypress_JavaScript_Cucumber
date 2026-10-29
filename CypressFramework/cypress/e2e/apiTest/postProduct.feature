Feature: Create products through the API

  Scenario: Create a product
    Given I have generated product data
    When I authenticate with valid API credentials
    And I create the product with the access token
    Then the product response status is 201
    And the created product matches the generated data
