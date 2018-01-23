'use strict';

const constants = require('../constants');

module.exports = {
  rules: {
    csp: constants.LEVEL_WARN,
    xfo: constants.LEVEL_WARN,
    xcto: constants.LEVEL_WARN,
    xxssp: constants.LEVEL_WARN,
    sts: constants.LEVEL_WARN,
    pkp: constants.LEVEL_OFF,
  },
  requiredGrade: 'B',
};
