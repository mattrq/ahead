'use strict';

const fetch = require('node-fetch');

module.exports = (url, config) => {
  const options = {
    method: 'HEAD',
    headers: {
      'User-Agent': 'Ahead - Security review of headers',
    },
    timeout: config.timeout * 1000 || 5000,
    follow: 0,
    redirect: 'manual',
  };

  return fetch(url, options);
};
