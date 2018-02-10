'use strict';

const nock = require('nock');
const { URL } = require('url');
const p = require('../../src/processor');

const baseUrl = 'http://localhost';

p.handleResults = jest.fn(() => {
  throw new Error('awd');
});

describe('Simple config', () => {
  describe('#fail', () => {
    test('No headers', (done) => {
      nock(baseUrl)
        .head('/')
        .reply(200);

      p.processor({ url: new URL(baseUrl) })
        .catch(() => {
          done();
        });
    });
  });
});
