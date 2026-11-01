Feature: User login

  Background:
    Given I open the DemoBlaze application

  Scenario: Log in with a registered account
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
