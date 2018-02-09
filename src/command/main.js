'use strict';

/* eslint no-console:off */

const commander = require('commander');
const chalk = require('chalk');
const processor = require('../processor');
const configs = require('../config');
const { URL } = require('url');

class URLPassedError extends Error {
  constructor(message) {
    super(message);
    this.name = 'URLPassedError';
  }
}

module.exports = (proc) => {
  let config;
  const error = (msg, secondary = '') => {
    console.error(chalk.red.bold(`\n  ${msg}\n`));
    if (secondary) {
      console.error(chalk.red(`  ${secondary}`));
    }
    commander.help();
    proc.exit(1);
    return Promise.reject(new Error(msg));
  };

  try {
    commander
      .version('0.1.0')
      .arguments('<url>', 'URl must be a valid url starting with "http://" or "https://"')
      .option('-g --grade <Grade>', 'Minimum Grade', /^(A+|[A-G])$/i, '')
      .option('-t --timeout <Timeout>', 'Timeout in seconds', parseInt, 10)
      .option('-s --ruleset <Ruleset>', 'Rules set', 'securityheaders')
      .action((url) => {
        config = configs[commander.ruleset];

        config.url = new URL(url);
        if (!/https?/.test(config.url.protocol)) throw new URLPassedError(url);
        config.secure = config.url.protocol === 'https:';
        config.timeout = commander.timeout;

        if (commander.grade) {
          config.requiredGrade = commander.grade.toUpperCase();
        }

        config.ruleset = commander.ruleset;
      })
      .parse(proc.argv); // end with parse to parse through the input
  } catch (e) {
    return error(
      'URL given is not in correct format & must be either HTTP or HTTPS.',
      `E.g. http://localhost:8080/, https://127.0.0.1 \nGiven: ${e.messsage}`
    );
  }

  if (!config) {
    return error('No url given!');
  }

  return processor(config)
    .catch(err => error(err.message));
};
