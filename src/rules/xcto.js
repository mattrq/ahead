'use strict';

const constants = require('../constants');

module.exports = {
  ruleId: 'xcto',
  appliesTo: constants.HTTP_HTTPS,
  points: 20,
  handle: (receivedHeaders) => {
    const header = 'x-content-type-options';
    return Promise.resolve(header in receivedHeaders);
  },
  message: 'X-Content-Type-Options header is missing',
  headerInformation: 'Inform browser who to entrpert  content',
};
