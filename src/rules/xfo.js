'use strict';

const constants = require('../constants');

module.exports = {
  ruleId: 'xfo',
  appliesTo: constants.HTTP_HTTPS,
  points: 20,
  handle: (receivedHeaders) => {
    const header = 'x-frame-options';
    return Promise.resolve(header in receivedHeaders);
  },
  message: 'X-Frame-Options-Options header is missing',
};
