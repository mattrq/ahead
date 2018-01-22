
'use strict';

/* eslint no-console:off */

/*
 *
 *
 * References:
 * https://scotthelme.co.uk/scoring-transparency-on-securityheaders-io/
 * https://scotthelme.co.uk/tag/securityheaders-io/
 */

const fetch = require('node-fetch');
const chalk = require('chalk');
const intersection = require('lodash.intersection');
const { grades } = require('../config');
const rules = require('../rules');

const hasFailed = (points, minGrade) => {
  const matchingGrade = grades.filter(grade => grade.name === minGrade.toUpperCase()).pop();
  if (matchingGrade) {
    return points < matchingGrade.points;
  }
  return true;
};

const getGrade = points =>
  (grades.filter(grade => (points >= grade.points || grade.points === 0)).shift());

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

  let points = 0;
  return fetch(config.uri, options)
    .then(res => res.headers.raw())
    .then((headers) => {
      const receivedHeaders = Object.keys(headers).map(header => header.toLowerCase());
      Object.keys(rules)
        .filter(key => (!rules[key].httpsOnly || config.secure === rules[key].httpsOnly))
        .forEach((key) => {
          const rule = rules[key];

          rule.headers = rule.headers.map(header => header.toLowerCase());
          if (intersection(rule.headers, receivedHeaders).length > 0) {
            points += rule.points;
          }
        });

      const grade = getGrade(points);
      console.log(chalk.keyword(grade.colour).bold(`\n   Site got a grade of ${grade.name}\n`));
      if (hasFailed(points, config.grade)) {
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
// console.log(grade, rules, `https://${uri}`);
//
// Promise.all([
//   // secure ? fetch(`https://${uri}`, options)
//   //   .then(res => res.headers.raw())
//   //   .catch(error => Promise.resolve(error)) : Promise.resolve([]),
//   fetch(`http://${uri}`, Object.assign(options, { follow: 0 }))
//     .then(res => res.headers.raw())
//     .catch(error => Promise.resolve(error)),
// ])
//   .then(([httpsHeaders, httpHeaders]) => {
//     console.log(httpHeaders, httpsHeaders);
//     processSeacure(httpHeaders, httpsHeaders);
//     processSeacure(httpHeaders, httpsHeaders);
//   });
