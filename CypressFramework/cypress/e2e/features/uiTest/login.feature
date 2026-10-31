Feature: User login

  Background:
    Given I open the DemoBlaze application

  Scenario: Log in with a registered account
    When I open the login form
    And I enter the registered account credentials
    And I submit the login form
    Then the registered user's welcome message is displayed
