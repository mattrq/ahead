'use strict';

const constants = require('../constants');

module.exports = {
  rules: {
    csp: constants.LEVEL_ERROR,
    xfo: constants.LEVEL_ERROR,
    xcto: constants.LEVEL_ERROR,
    xxssp: constants.LEVEL_ERROR,
    sts: constants.LEVEL_ERROR,
    pkp: constants.LEVEL_OFF,
    'no-powered-by': constants.LEVEL_ERROR,
  },
  requiredGrade: null,
};
