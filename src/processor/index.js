
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
const grades = require('../config/grades');
const rules = require('../rules');
const constants = require('../constants');

const hasFailed = (points, minGrade) => {
  const matchingGrade = grades.filter(grade => grade.name === minGrade.toUpperCase()).pop();
  if (matchingGrade) {
    return points < matchingGrade.points;
  }
  return true;
};

const getGrade = points =>
  (grades.filter(grade => (points >= grade.points || grade.points === 0)).shift());

const getApplicableRules = (config, secure) => {
  return rules.filter((rule) => {
    if (!rule.name || typeof rule.handle === 'function' || !rule.appliesTo) {
      return false;
    }

    if (
      rule.appliesTo !== constants.HTTP_HTTPS &&
      (rule.appliesTo !== (secure ? constants.HTTP_ONLY : constants.HTTPS_ONLY))
    ) {
      return false;
    }

    return (
      rule.name in config.rules &&
      config.rules[rule.name] !== constants.LEVEL_OFF
    );
  });
};

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
  const messages = [];
  return fetch(config.uri, options)
    .then(res => res.headers.raw())
    .then((headers) => {
      return Promise.all(getApplicableRules(config, config.secure)
        .map(rule => rule.handle(headers, config)
          .then((result) => {
            if (result === true) {
              points += rule.points;
            } else {

            }
          }),
        ))
        .then((results) => {
          const grade = getGrade(points);
          console.log(chalk.keyword(grade.colour).bold(`\n   Site got a grade of ${grade.name}\n`));
          if (hasFailed(points, config.grade)) {
            process.exit(1);
          }
        });


      //const receivedHeaders = Object.keys(headers).map(header => header.toLowerCase());
      // Object.keys(rules)
      //   .filter(key => (!rules[key].httpsOnly || config.secure === rules[key].httpsOnly))
      //   .forEach((key) => {
      //     const rule = rules[key];
      //
      //     rule.headers = rule.headers.map(header => header.toLowerCase());
      //     if (intersection(rule.headers, receivedHeaders).length > 0) {
      //       points += rule.points;
      //     }
      //   });


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
