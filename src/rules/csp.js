'use strict';

const intersection = require('lodash.intersection');
const constants = require('../constants');

module.exports = {
  ruleId: 'csp',
  appliesTo: constants.HTTP_HTTPS,
  points: 25,
  handle: (receivedHeaders) => {
    const headers = [
      'content-security-policy',
      'content-security-policy-report-only',
    ];
    return Promise.resolve(intersection(headers, Object.keys(receivedHeaders)).length > 0);
  },
  message: 'Content-Security-Policy header is missing ',
  headerInformation: 'Content Security Policy is an effective measure to protect your site from XSS attacks.' +
                     'By whitelisting sources of approved content, you can prevent the browser from loading malicious assets.',
};
