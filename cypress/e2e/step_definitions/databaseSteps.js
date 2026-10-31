import { Before, When, Then } from '@badeball/cypress-cucumber-preprocessor';

let databaseResult;

Before({ tags: '@database' }, function () {
  const database = Cypress.env('db');
  if (!database?.host || !database?.user || !database?.password || !database?.database) {
    Cypress.log({
      name: 'database',
      message: 'Skipping database scenario: configure DB_HOST, DB_USER, DB_PASSWORD, and DB_NAME.',
    });
    this.skip();
  }
});

When('I query the database for female users', () => {
  cy.task(
    'queryDb',
    'SELECT username from user_details where gender = "Female" order by user_id desc',
  ).then((result) => { databaseResult = result; });
});

Then('the database task returns rows', () => {
  cy.then(() => expect(databaseResult).to.be.an('array'));
});
