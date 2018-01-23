'use strict';

const defaultConfig = require('./default');
const secure = require('./secure');

module.exports = {
  default: defaultConfig,
  secure,
};
