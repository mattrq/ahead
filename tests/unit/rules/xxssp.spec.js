'use strict';

const csp = require('../../../src/rules/xxssp');
const constants = require('../../../src/constants');

describe('xxssp rule', () => {
  describe('check setup', () => {
    expect(csp.appliesTo).toEqual(constants.HTTP_HTTPS);
    expect(csp.ruleId).toEqual('xxssp');
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
    it('contains x-xss-protection', (done) => {
      csp.handle({ 'x-xss-protection': true })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
  });
});
