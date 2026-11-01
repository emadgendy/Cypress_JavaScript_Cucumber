# _Cypress Automation Framework_

Welcome to the Cypress Automation Framework repository! This framework is designed to simplify and streamline your UI, API, and performance testing using Cypress, a powerful end-to-end testing framework.

## Installation and Setup

To get started with this framework, follow these steps:

### 1. Install dependencies

```bash
npm install
```

The project uses Cypress with the Cucumber preprocessor and Gherkin `.feature` files. Install Node.js 18 or newer (which includes npm) before running npm commands.

On Windows, if PowerShell says `npm` or `node` is not recognized after installing Node.js, close and reopen the terminal (or restart VS Code) so it picks up the updated PATH. Confirm setup with:

```powershell
node --version
npm --version
```

### Code Structure
This Cypress Automation Framework follows a structured approach for better maintainability and scalability. Below is an overview of the code structure:
### Comprehensive Testing
This framework is designed to support various testing types:

- UI Testing: Gherkin scenarios are under `cypress/e2e/features/ui`.

- API Testing: Gherkin scenarios are under `cypress/e2e/features/api` and `cypress/e2e/apiTest`; Cypress spec tests are also under `cypress/e2e/apiTest`. They use `cypress/apiconfig.json` and `cypress/support/apiUtils.js`.

- Database Testing: Gherkin scenarios are under `cypress/e2e/features/database`.

- Step definitions: JavaScript implementations of Gherkin steps are under `cypress/e2e/step_definitions`.

- Performance Testing: This framework can be extended to include performance testing using Cypress performance plugins or custom scripts.For now we are capturing the time taken to perform actions on WEB UI.

### Folder Structure
- apiconfig.json: Contains the base URL and API endpoints for API testing.
- support: Contains utility files like apiUtils.js, which provides functions for common API interactions. These utilities are imported into API test files for reusability.

- reports: Stores test reports and screenshots generated during test execution.

- pageclass: Contains page class definitions for different web pages, making it easier to interact with web elements.

- logs: Logs generated during test execution are saved in this folder.

- fixtures: Test data in JSON format is stored here.

### Running Tests
Run the following commands from the `CypressFramework` directory, where `package.json` is located. From the repository root in PowerShell, enter the project directory first:
```powershell
cd .\CypressFramework
```

To run all API tests, use the following command:
```
npm run apitest
```
To run all UI tests, use the following command:
```
npm run uitest
```
To run database tests, use:
```
npm run dbtest
```
Database tests require `DB_HOST`, `DB_USER`, `DB_PASSWORD`, and `DB_NAME` environment variables. The database scenario is skipped when these are not configured.
To run every Gherkin scenario, use:
```
npm test
```
### To run only the register-account login scenario from powerShell, use:
```powershell
npx cypress run --spec "cypress/e2e/features/ui/accounts.feature" --env tags="@login"
```
Use `npx cypress run` to invoke Cypress directly; `npm cypress run` is not a valid npm command.
### Contributions and Feedback
Contributions and suggestions are welcome! If you find a bug or want to enhance the project, feel free to create a pull request. Please ensure your code follows best practices and includes appropriate tests.

Fork the repository.
- Create a new branch: git checkout -b feature/your-feature-name.
- Make changes and commit them: git commit -am 'Add new feature'.
- Push to the branch: git push origin feature/your-feature-name.
- Create a pull request.

### Note:
It seems to be some issue with the api hosted that I hosted on render,it works sometimes and sometimes not hence the api test cases fails.
You can use either your apiendpoints or you can change the url in apiconfig to - 
https://mobilestore-c8yg.onrender.com