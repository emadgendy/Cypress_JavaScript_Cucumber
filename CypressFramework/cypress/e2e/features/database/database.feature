Feature: Database queries

  Scenario: Query female users ordered by most recent user
    When I query the database for female users
    Then the database task returns rows
