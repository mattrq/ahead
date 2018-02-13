'use strict';

module.exports = {
  ruleId: 'sts/include-preload',
  appliesTo: (receivedHeaders) => {
    const header = 'strict-transport-security';
    return (header in receivedHeaders);
  },
  handle: (receivedHeaders) => {
    const result = /preload/i
      .test(receivedHeaders['strict-transport-security']);

    return Promise.resolve(result);
  },
  message: 'Strict-Transport-Security should include preload',
};
