Feature: Browse catalog

  Background:
    Given I open the DemoBlaze application

  Scenario: Verify monitor names and prices
    When I open the login form
    And I enter the registered account credentials
    And I submit the login form
    And I open the monitor category
    Then both expected monitors and prices are displayed
