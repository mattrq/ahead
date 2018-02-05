'use strict';

const constants = require('../constants');

module.exports = {
  ruleId: 'pkp',
  appliesTo: constants.HTTPS_ONLY,
  points: 0,
  handle: (receivedHeaders) => {
    const header = 'public-key-pins';
    return Promise.resolve(header in receivedHeaders);
  },
  message: 'Public-Key-Pins header is missing, validate the correct HTTPS certificate is used',
  headerInformation: 'Content Security Policy is an effective measure to protect your site from XSS attacks.' +
  'By whitelisting sources of approved content, you can prevent the browser from loading malicious assets.',
};
