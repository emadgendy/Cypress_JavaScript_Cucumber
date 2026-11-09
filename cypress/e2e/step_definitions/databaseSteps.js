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

Before({ tags: '@db2' }, function () {
  const database = Cypress.env('db2');
  if (!database?.host || !database?.user || !database?.password || !database?.database) {
    Cypress.log({
      name: 'database',
      message: 'Skipping Db2 scenario: configure DB2_HOST, DB2_USER, DB2_PASSWORD, and DB2_DATABASE.',
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

When('I query Db2 for a constant value', () => {
  cy.task('queryDb2', 'SELECT 1 AS RESULT FROM SYSIBM.SYSDUMMY1')
    .then((result) => { databaseResult = result; });
});

Then('Db2 returns the value 1', () => {
  cy.then(() => {
    expect(databaseResult).to.have.length(1);
    expect(databaseResult[0]).to.have.property('RESULT', 1);
  });
});
