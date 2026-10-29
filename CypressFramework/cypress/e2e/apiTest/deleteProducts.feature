Feature: Delete products through the API

  Scenario: Delete a newly created product
    Given I have generated product data
    When I authenticate with valid API credentials
    And I create and delete the product with the access token
    Then the product response status is 200
