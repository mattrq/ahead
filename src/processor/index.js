'use strict';

/* eslint no-console:off */

const fetch = require('node-fetch');
const chalk = require('chalk');
const grades = require('../config/grades');
const rules = require('../rules');
const constants = require('../constants');

const hasFailed = (points, minGrade) => {
  const matchingGrade = grades.filter(grade => grade.name === minGrade).pop();
  if (matchingGrade) {
    return points < matchingGrade.points;
  }
  return true;
};

const getGrade = points =>
  (grades.filter(grade => (points >= grade.points || grade.points === 0)).shift());

const getApplicableRules = (rulesToApply, secure) => (
  rules.filter((rule) => {
    if (!rule.name || typeof rule.handle !== 'function' || !rule.appliesTo) {
      return false;
    }

    if (rule.appliesTo === (secure ? constants.HTTP_ONLY : constants.HTTPS_ONLY)) {
      return false;
    }

    return (
      rule.name in rulesToApply &&
      rulesToApply[rule.name] !== constants.LEVEL_OFF
    );
  })
);

const processor = (config) => {
  const options = {
    method: 'HEAD',
    headers: {
      'User-Agent': 'Ahead - Security review of headers',
    },
    timeout: config.timeout * 1000,
    follow: 0,
    redirect: 'manual',
  };

  const rulesToRun = getApplicableRules(config.rules, config.secure);

  if (rulesToRun.length === 0) {
    return Promise.reject(new Error('No rules to run'));
  }

  let points = 0;
  let fail = false;
  const messages = [];

  const processResult = ([result, rule]) => {
    if (result === true) {
      points += rule.points;
    } else {
      const level = config.rules[rule.name];
      if (level === constants.LEVEL_ERROR) {
        fail = true;
      }
      const message = {
        name: rule.name,
        level,
        message: rule.message,
      };
      messages.push(message);
    }
    return {
      rule,
      result,
    };
  };

  return fetch(config.url.href, options)
    .then(res => res.headers.raw())
    .then(headers => Promise.all(rulesToRun
      .map(rule => [rule.handle(headers, config), rule])
      .then(processResult)))
    .then(() => {
      const grade = getGrade(points);
      console.log(chalk.keyword(grade.colour).bold(`\n   Site got a grade of ${grade.name}\n`));
      if (
        fail ||
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

module.exports = {
  getGrade,
  hasFailed,
  processor,
};
