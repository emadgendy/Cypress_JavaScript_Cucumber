const { defineConfig } = require('cypress');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const mysql = require('mysql')
const createBundler = require('@bahmutov/cypress-esbuild-preprocessor');
const { addCucumberPreprocessorPlugin } = require('@badeball/cypress-cucumber-preprocessor');
const { createEsbuildPlugin } = require('@badeball/cypress-cucumber-preprocessor/esbuild');
const reportDir = process.env.REPORT_DIR || 'cypress/reports';
const reportName = process.env.REPORT_NAME || 'TestReport';


module.exports = defineConfig({
  projectId: "kveppv",
  reporter: 'cypress-mochawesome-reporter',
  reporterOptions: {
    reportDir: `${reportDir}/${reportName}`, // Report directory based on environment variables
    overwrite: false, // Set to true to overwrite reports on each run
  },
  e2e: {
    specPattern: [
      'cypress/e2e/**/*.feature',
      'cypress/e2e/apiTest/**/*.spec.js',
    ],
    async setupNodeEvents(on, config) {
      await addCucumberPreprocessorPlugin(on, config);
      on('file:preprocessor', createBundler({
        plugins: [createEsbuildPlugin(config)],
      }));
      require('cypress-mochawesome-reporter/plugin')(on);
      on('task',
        {
          queryDb: query => { return queryTestDb(query, config) },
          loadUiTestData: () => yaml.load(fs.readFileSync(
            path.join(__dirname, 'cypress', 'support', 'TestData', 'ui-test-data.yaml'),
            'utf8',
          )),
        });
      return config;
    },
  },
  "env": {
    "db": {
      "host": process.env.DB_HOST,
      "user": process.env.DB_USER,
      "password": process.env.DB_PASSWORD,
      "database": process.env.DB_NAME
    }
  }
})

function queryTestDb(query, config) {
  // creates a new mysql connection using credentials from cypress.json env's
  const connection = mysql.createConnection(config.env.db)
  // start connection to db
  connection.connect()
  // exec query + disconnect to db as a Promise
  return new Promise((resolve, reject) => {
      connection.query(query, (error, results) => {
          if (error) reject(error)
          else {
              connection.end()
              return resolve(results)
          }
      })
  })
}