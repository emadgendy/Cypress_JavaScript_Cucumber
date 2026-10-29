Feature: Retrieve products through the API

  Scenario: Retrieve products with valid credentials
    When I authenticate with valid API credentials
    And I request the product list with the access token
    Then the product response status is 200
    And the product list contains the expected devices

  Scenario: Validate product response data
    When I authenticate with valid API credentials
    And I request the product list with the access token
    Then the product response status is 200
    And the first product cost and Samsung Galaxy M33 are correct

  Scenario: Reject a revoked token when listing products
    When I request the product list with a revoked token
    Then the product response status is 401
    And the API error message is "Error access_token is revoked"

  Scenario: Reject a missing token when listing products
    When I request the product list without a token
    Then the product response status is 401
    And the API error message is "Error in authorization format"
