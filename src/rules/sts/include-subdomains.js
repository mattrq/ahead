'use strict';

module.exports = {
  ruleId: 'sts/include-subdomains',
  appliesTo: (receivedHeaders) => {
    const header = 'strict-transport-security';
    return (header in receivedHeaders);
  },
  handle: (receivedHeaders) => {
    const result = /(;| )includeSubDomains(;|$)/
      .test(receivedHeaders['strict-transport-security']);

    return Promise.resolve(result);
  },
  message: 'Strict-Transport-Security should include includeSubDomains',
};
