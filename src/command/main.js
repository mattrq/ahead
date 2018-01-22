'use strict';

const program = require('commander');
const chalk = require('chalk');
const { processor } = require('../processor/index');

module.exports = (process) => {
  const urlRegex = /^((https?):\/\/(([0-9a-z\\.]+)(:\d+)?(\/|#|\?|$)))/i;
  const config = {};

  /* eslint no-console:off */

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
      [config.uri, config.secure, config.partialUri, config.domain] = url.match(urlRegex).slice(1);

      config.secure = config.secure.toLowerCase() === 'https';
      config.timeout = program.timeout;
      config.grade = program.grade;
    })
    .parse(process.argv); // end with parse to parse through the input

  if (!config.uri) {
    console.error(chalk.red.bold('\n  No url given!'));
    program.help();
    process.exit(1);
  }

  processor(config)
    .catch((error) => {
      console.error(chalk.red(`  ${error.message}`));
      program.help();
      process.exit(1);
    });
};
