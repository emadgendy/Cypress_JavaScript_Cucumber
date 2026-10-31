Feature: API authentication

  Scenario: Authenticate with valid credentials
    When I authenticate with valid API credentials
    Then the API responds with status 200 and an access token

  Scenario: Reject invalid credentials
    When I authenticate with an incorrect email
    Then the API responds with status 401
    And the API error message is "Incorrect email or password"
