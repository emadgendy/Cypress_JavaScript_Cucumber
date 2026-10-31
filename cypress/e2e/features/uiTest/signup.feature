Feature: Account registration

  Background:
    Given I open the DemoBlaze application

  Scenario: Register a new account
    When I click on "SignUp.navigation" button
    And I enter a unique signup username and registered password
    And I click on "SignUp.form" button
    Then the signup alert contains "Sign up successful."

  Scenario: Reject an existing account
    When I click on "SignUp.navigation" button
    And I enter the registered signup credentials
    And I click on "SignUp.form" button
    Then the signup alert contains "This user already exist."

  Scenario: Require signup credentials
    When I click on "SignUp.navigation" button
    And I click on "SignUp.form" button
    Then the signup alert contains "Please fill out Username and Password."
