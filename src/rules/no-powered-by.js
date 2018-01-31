'use strict';

const constants = require('../constants');

module.exports = {
  ruleId: 'no-powered-by',
  appliesTo: constants.HTTP_HTTPS,
  handle: (receivedHeaders) => {
    const header = 'x-powered-by';
    return Promise.resolve(!(header in receivedHeaders));
  },
};
