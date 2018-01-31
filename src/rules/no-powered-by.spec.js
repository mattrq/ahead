'use strict';

const csp = require('./no-powered-by');
const constants = require('../constants');

describe('no-powered-by rule', () => {
  describe('check setup', () => {
    expect(csp.appliesTo).toEqual(constants.HTTP_HTTPS);
    expect(csp.ruleId).toEqual('no-powered-by');
  });

  describe('#fail', () => {
    it('contains x-powered-by', (done) => {
      csp.handle({ 'x-powered-by': true })
        .then((result) => {
          expect(result).toEqual(false);
          done();
        });
    });
  });

  describe('#pass', () => {
    it('no headers', (done) => {
      csp.handle({})
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
    it('different', (done) => {
      csp.handle({ 'content-type': true })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
  });
});
