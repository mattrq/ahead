'use strict';

module.exports = {
  ruleId: 'sts/max-age',
  appliesTo: (receivedHeaders) => {
    const header = 'strict-transport-security';
    return (header in receivedHeaders);
  },
  handle: (receivedHeaders) => {
    const match = /(;| )max-age=(\d+)(;|$)/
      .exec(receivedHeaders['strict-transport-security']);

    if (!match) {
      return Promise.resolve(false);
    }

    const maxAge = Number.parseInt(match[2], 10);

    return Promise.resolve(maxAge >= (24 * 60 * 60 * 365));
  },
  message: 'Strict-Transport-Security should include includeSubDomains',
};
