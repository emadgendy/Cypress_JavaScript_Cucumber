Feature: Account registration

  Background:
    Given I open the DemoBlaze application

  Scenario: Register a new account
    When I click on "SignUp.navigation" button
    And I enter a unique signup username and registered password
    And I click on "SignUp.form" button
    Then I see "SignUp.alert" text to equal "Sign up successful."
    And I record UI performance for "registerUser"

  Scenario: Reject an existing account
    When I click on "SignUp.navigation" button
    And I enter the registered signup credentials
    And I click on "SignUp.form" button
    Then I see "SignUp.alert" text to equal "This user already exist."
    And I record UI performance for "registerUser"

  Scenario: Require signup credentials
    When I click on "SignUp.navigation" button
    And I click on "SignUp.form" button
    Then I see "SignUp.alert" text to equal "Please fill out Username and Password."
    And I record UI performance for "registerUser"
