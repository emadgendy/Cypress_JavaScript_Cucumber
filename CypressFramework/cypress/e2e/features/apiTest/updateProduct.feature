Feature: Update products through the API

  Scenario: Update an existing product
    Given I have generated product data
    When I authenticate with valid API credentials
    And I update product 1 with the access token
    Then the product response status is 200
    And the updated product quantity matches the generated data

  Scenario: Reject an update without an authorization token
    Given I have generated product data
    When I update product 1 without a token
    Then the product response status is 401
    And the API error message is "Error in authorization format"

  Scenario: Reject an update with a revoked token
    Given I have generated product data
    When I update product 1 with a revoked token
    Then the product response status is 401
    And the API error message is "Error access_token is revoked"
