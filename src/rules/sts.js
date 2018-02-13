'use strict';

const constants = require('../constants');

module.exports = {
  ruleId: 'sts',
  appliesTo: constants.HTTPS_ONLY,
  points: 25,
  handle: (receivedHeaders) => {
    const header = 'strict-transport-security';
    return Promise.resolve(header in receivedHeaders);
  },
  message: 'Strict-Transport-Security header is missing',
};
