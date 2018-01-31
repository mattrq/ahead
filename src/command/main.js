'use strict';

/* eslint no-console:off */

const commander = require('commander');
const chalk = require('chalk');
const processor = require('../processor');
const configs = require('../config');
const { URL } = require('url');

module.exports = (proc) => {
  const error = (msg, secondary = '') => {
    console.error(chalk.red.bold(`\n  ${msg}\n`));
    if (secondary) {
      console.error(chalk.red(`  ${secondary}`));
    }
    commander.help();
    proc.exit(1);
    return Promise.reject(new Error(msg));
  };

  const cfg = commander
    .version('0.1.0')
    .arguments('<url>', 'URl must be a valid url starting with "http://" or "https://"')
    .option('-g --grade <Grade>', 'Minimum Grade', /^(A+|[A-G])$/i, '')
    .option('-t --timeout <Timeout>', 'Timeout in seconds', parseInt, 10)
    .option('-s --ruleset <Ruleset>', 'Rules set', 'securityheaders')
    .action((url) => {
      const config = configs[commander.ruleset];

      try {
        config.url = new URL(url);
        if (!/https?/.test(config.url.protocol)) throw new Error('');
      } catch (e) {
        return error(
          'URL given is not in correct format & must be either HTTP or HTTPS.',
          'E.g. http://localhost:8080/, https://127.0.0.1' // eslint-disable-line comma-dangle
        );
      }

      config.secure = config.url.protocol === 'https:';
      config.timeout = commander.timeout;

      if (commander.grade) {
        config.requiredGrade = commander.grade.toUpperCase();
      }

      config.ruleset = commander.ruleset;

      return config;
    })
    .parse(proc.argv); // end with parse to parse through the input

  if (!cfg || cfg === commander) {
    return error('No url given!');
  }

  if (cfg instanceof Promise) {
    return cfg;
  }

  return processor(cfg)
    .catch(err => error(err.message));
};
