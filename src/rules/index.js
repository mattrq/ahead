'use strict';

const csp = require('./csp');
const xfo = require('./xfo');
const xcto = require('./xcto');
const xxssp = require('./xxssp');
const sts = require('./sts');
const pkp = require('./pkp');
const noPoweredBy = require('./no-powered-by');

module.exports = [
  csp,
  xfo,
  xcto,
  xxssp,
  sts,
  pkp,
  noPoweredBy,
];
