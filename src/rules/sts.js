'use strict';

const constants = require('../constants');

module.exports = {
  name: 'sts',
  appliesTo: constants.HTTPS_ONLY,
  points: 25,
  handle: (receivedHeaders) => {
    const header = 'strict-transport-security';
    return Promise.resolve(header in receivedHeaders);
  },
};
