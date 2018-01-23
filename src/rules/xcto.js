'use strict';

const constants = require('../constants');

module.exports = {
  name: 'xcto',
  appliesTo: constants.HTTP_HTTPS,
  points: 20,
  handle: (receivedHeaders) => {
    const header = 'x-content-type-options';
    return Promise.resolve(header in receivedHeaders);
  },
};
