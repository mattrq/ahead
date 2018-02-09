'use strict';

/* eslint no-console:off */

const chalk = require('chalk');
const constants = require('../constants');
const fetch = require('../helpers/fetch');
const output = require('../formatter/stylish');
const rules = require('../rules');
const { getGrade, hasFailed } = require('../helpers/grade');

const getApplicableRules = (rulesToApply, secure, headers) => (
  rules.filter((rule) => {
    // Basic checks of the details
    if (!rule.ruleId || typeof rule.handle !== 'function' || !rule.appliesTo) {
      return false;
    }

    // Make sure the rule in in the ruleset to apply and turned on
    if (
      !(rule.ruleId in rulesToApply) ||
      rulesToApply[rule.ruleId] === constants.LEVEL_OFF
    ) {
      return false;
    }

    // Check if the rule applies
    switch (typeof rule.appliesTo) {
      case 'function': {
        return rule.appliesTo(headers);
      }
      case 'string': {
        const allow = [constants.HTTP_HTTPS];
        allow.push(secure ? constants.HTTPS_ONLY : constants.HTTP_ONLY);
        return allow.includes(rule.appliesTo);
      }
      default: {
        return false;
      }
    }
  })
);

const handleHeaders = (headers, config) => {
  const rulesToRun = getApplicableRules(
    config.rules,
    config.secure,
    headers
  );

  if (rulesToRun.length === 0) {
    return Promise.reject(new Error('No rules to run'));
  }

  const runRules = rulesToRun
    .map(rule => rule.handle(headers, config)
      .then(result => (Object.assign(rule, {
        result,
        level: config.rules[rule.ruleId],
      }))));

  return Promise.all(runRules);
};

const getPoints = results =>
  results.reduce(
    (points, result) => {
      if (result.result === true && result.points) {
        return points + result.points;
      }
      return points;
    },
    0
  );

const handResults = (results, config) => {
  const points = getPoints(results);
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
};

const processor = config => (
  fetch(config.url.href, config)
    .then(res => res.headers.raw())
    .then(headers => handleHeaders(headers, config))
    .then(results => handResults(results, config))
    .catch((error) => {
      if (error.name === 'FetchError') {
        console.error(chalk.red.bold(`\n  Unable to fetch ${config.uri}!`));
      }
      throw error;
    })
);

module.exports = processor;
