Feature: User login

  Background:
    Given I open the DemoBlaze application

  Scenario: Log in with a registered account
    When I click on "SignUp.navigation" button
    And I enter a unique signup username and registered password
    And I click on "SignUp.form" button
    Then the signup alert contains "Sign up successful."
    When I click on "Login.navigation" button
    And I enter the registered account credentials
    And I click on "Login.form" button
    Then the registered user's welcome message is displayed
