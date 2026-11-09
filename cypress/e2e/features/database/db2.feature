@db2
Feature: Db2 database queries

  Scenario: Run a simple query against Db2
    When I query Db2 for a constant value
    Then Db2 returns the value 1
