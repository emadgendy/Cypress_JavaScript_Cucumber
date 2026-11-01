Feature: Browse catalog

  Background:
    Given I open the DemoBlaze application

  Scenario: Verify monitor names and prices
    When I click on "SignUp.navigation" button
    And I enter a unique signup username and registered password
    And I click on "SignUp.form" button
    Then I see "SignUp.alert" text to equal "Sign up successful."
    And I record UI performance for "registerUser"
    When I click on "Login.navigation" button
    And I enter the registered account credentials
    And I click on "Login.form" button
    Then I see "Login.requestStatus" text to equal "200"
    And I see "Login.alert" text to equal ""
    Then I see "Login.welcomemsg" text to contain "Welcome"
    And I record UI performance for "LoginUser"
    When I click on "Monitor.category" button
    Then I see "Monitor.monitor1" text to equal "Apple monitor 24"
    And I see "Monitor.m1price" text to equal "$400"
    And I see "Monitor.monitor2" text to equal "ASUS Full HD"
    And I see "Monitor.m2price" text to equal "$230"
    And I record UI performance for "ValidateMonitor's"
