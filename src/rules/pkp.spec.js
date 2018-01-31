'use strict';

const csp = require('./pkp');
const constants = require('../constants');

describe('pkp rule', () => {
  describe('check setup', () => {
    expect(csp.appliesTo).toEqual(constants.HTTPS_ONLY);
    expect(csp.ruleId).toEqual('pkp');
  });

  describe('#fail', () => {
    it('no headers', (done) => {
      csp.handle({})
        .then((result) => {
          expect(result).toEqual(false);
          done();
        });
    });
    it('different', (done) => {
      csp.handle({ 'content-type': true })
        .then((result) => {
          expect(result).toEqual(false);
          done();
        });
    });
  });

  describe('#pass', () => {
    it('contains public-key-pins', (done) => {
      csp.handle({ 'public-key-pins': true })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
  });
});
