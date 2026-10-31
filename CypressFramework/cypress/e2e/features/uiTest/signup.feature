Feature: Account registration

  Background:
    Given I open the DemoBlaze application

  Scenario: Register a new account
    When I open the signup form
    And I enter a unique signup username and registered password
    And I submit the signup form
    Then the signup alert contains "Sign up successful."

  Scenario: Reject an existing account
    When I open the signup form
    And I enter the registered signup credentials
    And I submit the signup form
    Then the signup alert contains "This user already exist."

  Scenario: Require signup credentials
    When I open the signup form
    And I submit the signup form without credentials
    Then the signup alert contains "Please fill out Username and Password."
