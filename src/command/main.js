'use strict';

/* eslint no-console:off */

const program = require('commander');
const chalk = require('chalk');
const { processor } = require('../processor/index');
const configs = require('../config');
const { URL } = require('url');

const error = (msg, secondary = '') => {
  console.error(chalk.red.bold(`\n  ${msg}\n`));
  if (secondary) {
    console.error(chalk.red(`  ${secondary}`));
  }
  program.help();
  process.exit(1);
};

module.exports = (process) => {
  let actionApplied = false;

  program
    .version('0.1.0')
    .arguments('<url>', 'URl must be a valid url starting with "http://" or "https://"')
    .option('-g --grade <Grade>', 'Minimum Grade', /^(A+|[A-G])$/i)
    .option('-t --timeout <Timeout>', 'Minimum Grade', parseInt, 5)
    .option('-s --ruleset <Ruleset>', 'Rules set', 'default')
    .action((url) => {
      const config = configs[program.ruleset];
      try {
        config.url = new URL(url);
        if (!/https?/.test(config.url.protocol)) {
          error(
            'URL given is not in correct format, must be either HTTP or HTTPS.',
            'E.g. http://localhost:8080/, https://127.0.0.1' // eslint-disable-line comma-dangle
          );
        }
      } catch (e) {
        error(
          'URL given is not in correct format, must be either HTTP or HTTPS.',
          'E.g. http://localhost:8080/, https://127.0.0.1' // eslint-disable-line comma-dangle
        );
      }

      config.secure = config.url.protocol === 'https';
      config.timeout = program.timeout;

      if (program.grade) {
        config.requiredGrade = program.grade.toUpperCase();
      }
      config.ruleset = program.ruleset;

      actionApplied = true;

      processor(config)
        .catch(err => error(err.message));
    })
    .parse(process.argv); // end with parse to parse through the input

  if (!actionApplied) {
    error('No url given!');
  }
};
