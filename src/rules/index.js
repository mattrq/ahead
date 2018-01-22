'use strict';

module.exports = {
  CSP: {
    headers: [
      'Content-Security-Policy',
      'Content-Security-Policy-Report-Only',
    ],
    httpsOnly: false,
    points: 25,
  },
  XFO: {
    headers: [
      'X-Frame-Options',
    ],
    httpsOnly: false,
    points: 20,
  },
  XCTO: {
    headers: [
      'X-Content-Type-Options',
    ],
    httpsOnly: false,
    points: 20,
  },
  XXSSP: {
    headers: [
      'X-XSS-Protection',
    ],
    httpsOnly: false,
    points: 20,
  },
  STS: {
    headers: [
      'Strict-Transport-Security',
    ],
    httpsOnly: true,
    points: 25,
  },
  PKP: {
    headers: [
      'Content-Security-Policy',
    ],
    httpsOnly: true,
    points: 0,
  },
};
