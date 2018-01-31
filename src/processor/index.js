'use strict';

/* eslint no-console:off */

const fetch = require('node-fetch');
const chalk = require('chalk');
const constants = require('../constants');
const output = require('../formatter/stylish');
const rules = require('../rules');
const { getApplicableRules, getGrade, hasFailed } = require('../helpers/grade');

module.exports = (config) => {
  const options = {
    method: 'HEAD',
    headers: {
      'User-Agent': 'Ahead - Security review of headers',
    },
    timeout: config.timeout * 1000,
    follow: 0,
    redirect: 'manual',
  };

  const rulesToRun = getApplicableRules(config.rules, config.secure, rules);

  if (rulesToRun.length === 0) {
    return Promise.reject(new Error('No rules to run'));
  }

  let points = 0;
  return fetch(config.url.href, options)
    .then(res => res.headers.raw())
    .then(headers => Promise.all(rulesToRun
      .map(rule => rule.handle(headers, config)
        .then((result) => {
          if (result === true) {
            points += rule.points;
            return null;
          }
          return {
            ...rule,
            result,
            level: config.rules[rule.ruleId],
            message: 'test',
          };
        }))))
    .then((data) => {
      const results = data.filter(item => item);
      const grade = getGrade(points);
      if (results.length) {
        console.log(output(results));
      }
      if (config.requiredGrade) {
        console.log(chalk.keyword(grade.colour).bold(`\n   Site got a grade of ${grade.name}\n`));
      }

      if (
        results.filter(message => message.level === constants.LEVEL_ERROR).length ||
        (config.requiredGrade && hasFailed(points, config.requiredGrade))
      ) {
        process.exit(1);
      }
    })
    .catch((error) => {
      if (error.name === 'FetchError') {
        console.error(chalk.red.bold(`\n  Unable to fetch ${config.uri}!`));
      }
      throw error;
    });
};
