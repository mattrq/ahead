'use strict';

const constants = require('../constants');

module.exports = {
  name: 'pkp',
  appliesTo: constants.HTTPS_ONLY,
  points: 0,
  handle: (receivedHeaders) => {
    const header = 'public-key-pins';
    return Promise.resolve(header in receivedHeaders);
  },
};
