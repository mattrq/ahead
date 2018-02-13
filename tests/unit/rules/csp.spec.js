'use strict';

const csp = require('../../../src/rules/csp');
const constants = require('../../../src/constants');

describe('csp rule', () => {
  describe('check setup', () => {
    expect(csp.appliesTo).toEqual(constants.HTTP_HTTPS);
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
    it('contains content-security-policy', (done) => {
      csp.handle({ 'content-security-policy': true })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });

    it('contains content-security-policy-report-only', (done) => {
      csp.handle({ 'content-security-policy-report-only': true })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });

    it('contains content-security-policy-report-only & content-security-policy', (done) => {
      csp.handle({
        'content-security-policy-report-only': true,
        'content-security-policy': true,
      })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
  });
});
