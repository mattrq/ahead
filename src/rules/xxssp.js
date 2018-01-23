'use strict';

const constants = require('../constants');

module.exports = {
  name: 'xxssp',
  appliesTo: constants.HTTP_HTTPS,
  points: 20,
  handle: (receivedHeaders) => {
    const header = 'x-xss-protection';
    return Promise.resolve(header in receivedHeaders);
  },
};
