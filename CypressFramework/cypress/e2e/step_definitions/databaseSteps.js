import { When, Then } from '@badeball/cypress-cucumber-preprocessor';

let databaseResult;

When('I query the database for female users', () => {
  cy.task(
    'queryDb',
    'SELECT username from user_details where gender = "Female" order by user_id desc',
  ).then((result) => { databaseResult = result; });
});

Then('the database task returns rows', () => {
  cy.then(() => expect(databaseResult).to.be.an('array'));
});
