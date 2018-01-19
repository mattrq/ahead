#!/usr/bin/env node


/* eslint no-console:off */

/*
 *
 *
 * References:
 * https://scotthelme.co.uk/scoring-transparency-on-securityheaders-io/
 * https://scotthelme.co.uk/tag/securityheaders-io/
 */

const fetch = require('node-fetch');
const program = require('commander');
const chalk = require('chalk');
const intersection = require('lodash.intersection');

const urlRegex = /^((https?):\/\/(([0-9a-z\\.]+)(:\d+)?(\/|#|\?|$)))/i;
const c = {
  INFO: 'info',
  WARN: 'warn',
  CRIT: 'crit',
};

let uri;
let partialUri; // eslint-disable-line no-unused-vars
let secure;
let domain; // eslint-disable-line no-unused-vars

program
  .version('0.1.0')
  .arguments('<url>', 'URl must be a valid url starting with "http://" or "https://"')
  .option('-g --grade <Grade>', 'Minumum Grade', /^(A+|[A-G])$/i, 'B')
  .option('-t --timeout <Timeout>', 'Minumum Grade', parseInt, 5)

  // .option('-o, --option', 'option description', )
  // .option('-m, --more', 'we can have as many options as we want')
  // .option('-i, --input [optional]', 'optional user input')
  // .option('-I, --another-input <required>', 'required user input')
  .action((url) => {
    if (!urlRegex.test(url)) {
      console.error(chalk.red.bold('\n  URL given is not in correct format.\n'));
      console.error(chalk.red('  E.g. http://localhost:8080/, https://127.0.0.1'));
      program.help();
      process.exit(1);
    }
    [uri, secure, partialUri, domain] = url.match(urlRegex).slice(1);

    secure = secure.toLowerCase() === 'https';
  })
  .parse(process.argv); // end with parse to parse through the input

if (!uri) {
  console.error(chalk.red.bold('No url given!'));
  program.help();
  process.exit(1);
}

const options = {
  method: 'HEAD',
  headers: {
    'User-Agent': 'Ahead - Security review of headers',
  },
  timeout: program.timeout * 1000,
  follow: 0,
  redirect: 'manual',
};

const rules = {
  CSP: {
    headers: [
      'Content-Security-Policy',
      'Content-Security-Policy-Report-Only',
    ],
    httpsOnly: false,
    points: 25,
  },
  XFO: {
    headers: [
      'X-Frame-Options',
    ],
    httpsOnly: false,
    points: 20,
    tests: [
      { match: /^ALLOW-FROM/i, message: '', severity: c.INFO },
    ],
  },
  XCTO: {
    headers: [
      'X-Content-Type-Options',
    ],
    httpsOnly: false,
    points: 20,
  },
  XXSSP: {
    headers: [
      'X-XSS-Protection',
    ],
    httpsOnly: false,
    points: 20,
  },
  STS: {
    headers: [
      'Strict-Transport-Security',
    ],
    httpsOnly: true,
    points: 25,
  },
  PKP: {
    headers: [
      'Content-Security-Policy',
    ],
    httpsOnly: true,
    points: 0,
  },
};

const grades = [
  { name: 'A+', points: 95, colour: 'green' },
  { name: 'A', points: 75, colour: 'green' },
  { name: 'B', points: 60, colour: 'yellow' },
  { name: 'C', points: 50, colour: 'yellow' },
  { name: 'D', points: 29, colour: 'orange' },
  { name: 'E', points: 14, colour: 'red' },
  { name: 'F', points: 0, colour: 'red' },
];

const hasFailed = (points, minGrade) => {
  const matchingGrades = grades.filter(grade => grade.name === minGrade.toUpperCase());
  if (matchingGrades.length > 0) {
    return points < matchingGrades[matchingGrades.length - 1].points;
  }
  return true;
};

const getGrade = points =>
  (grades.filter(grade => (points >= grade.points || grade.points === 0)).shift());

let points = 0;
fetch(uri, options)
  .then(res => res.headers.raw())
  .then((headers) => {
    const recievedHeaders = Object.keys(headers).map(header => header.toLowerCase());
    Object.keys(rules)
      .filter(key => (!rules[key].httpsOnly || secure === rules[key].httpsOnly))
      .forEach((key) => {
        const rule = rules[key];

        rule.headers = rule.headers.map(header => header.toLowerCase());
        if (intersection(rule.headers, recievedHeaders).length > 0) {
          points += rule.points;
        }
      });

    const grade = getGrade(points);
    console.log(chalk.keyword(grade.colour).bold(`\n   Site got a grade of ${grade.name}\n`));
    if (hasFailed(points, program.grade)) {
      process.exit(1);
    }
  })
  .catch((error) => {
    if (error.name === 'FetchError') {
      console.error(chalk.red.bold(`\n  Unable to fetch ${uri}!`));
    }
    console.error(chalk.red(`  ${error.message}`));
    program.help();
    process.exit(4);
  });

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
