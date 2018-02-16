/**
 * @fileoverview Module for loading rules from files and directories.
 * @author Michael Ficarra
 */

'use strict';

//------------------------------------------------------------------------------
// Requirements
//------------------------------------------------------------------------------

const fs = require('fs');
const path = require('path');

//------------------------------------------------------------------------------
// Public Interface
//------------------------------------------------------------------------------

/**
 * Load all rule modules from specified directory.
 * @param {string} [rulesDir] Path to rules directory, may be relative. Defaults to `lib/rules`.
 * @param {string} cwd Current working directory
 * @returns {Object} Loaded rule modules by rule ids (file names).
 */
const loadRules = (rulesDir, cwd) => {
  const rules = [];

  const fullRulesDir = path.resolve(cwd, rulesDir);

  if (fs.lstatSync(fullRulesDir).isDirectory()) {
    fs.readdirSync(fullRulesDir).forEach((file) => {
      const fullPath = path.join(fullRulesDir, file);
      rules.push(loadRules(fullPath));
    });
  } else if (
    path.basename(fullRulesDir) !== 'index.js' &&
    /\.jsx?/i.test(path.extname(fullRulesDir)) &&
    path.basename(fullRulesDir) !== path.basename(__filename)
  ) {
    // eslint-disable-next-line import/no-dynamic-require, global-require
    return require(fullRulesDir);
  }

  return rules
    .filter(rule => (!!rule))
    .reduce((a, rs) => {
      if (rs instanceof Array) {
        rs.forEach((r) => { a.push(r); });
      } else {
        a.push(rs);
      }
      return a;
    }, []);
};

module.exports = loadRules;
