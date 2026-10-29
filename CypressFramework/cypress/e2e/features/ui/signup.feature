Feature: Account registration

  Background:
    Given I open the DemoBlaze application

  Scenario: Register a new account
    When I register with a unique username
    Then the signup alert contains "Sign up successful."

  Scenario: Reject an existing account
    When I register with the existing account
    Then the signup alert contains "This user already exist."

  Scenario: Require signup credentials
    When I submit signup without credentials
    Then the signup alert contains "Please fill out Username and Password."
