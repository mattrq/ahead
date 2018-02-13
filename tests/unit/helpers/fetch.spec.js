'use strict';

const fetch = require('../../../src/helpers/fetch');
const nodeFetch = require('node-fetch');

jest.mock('node-fetch');

describe('fetch Helper', () => {
  const defaultOptions = {
    method: 'HEAD',
    headers: {
      'User-Agent': 'Ahead - Security review of headers',
    },
    timeout: 5000,
    follow: 0,
    redirect: 'manual',
  };

  test('test default', () => {
    fetch('http://localhost', {});
    expect(nodeFetch).toBeCalledWith('http://localhost', defaultOptions);
  });

  test('test with timeout set', () => {
    fetch('http://localhost', { timeout: 3 });
    const expectedConfig = Object.assign(defaultOptions, { timeout: 3000 });
    expect(nodeFetch).toBeCalledWith('http://localhost', expectedConfig);
  });
});
