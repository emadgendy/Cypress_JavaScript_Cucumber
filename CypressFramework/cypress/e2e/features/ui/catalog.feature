Feature: Browse catalog

  Background:
    Given I open the DemoBlaze application

  Scenario: Verify monitor names and prices
    When I log in with the registered account
    And I open the monitor category
    Then both expected monitors and prices are displayed
