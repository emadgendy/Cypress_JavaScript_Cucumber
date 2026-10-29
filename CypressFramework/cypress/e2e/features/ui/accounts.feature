Feature: Account management

  Background:
    Given I open the DemoBlaze application

  @login
  Scenario: Log in with a registered account
    When I log in with the registered account
    Then the registered user's welcome message is displayed
