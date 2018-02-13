'use strict';

const csp = require('../../../src/rules/xcto');
const constants = require('../../../src/constants');

describe('xcto rule', () => {
  describe('check setup', () => {
    expect(csp.appliesTo).toEqual(constants.HTTP_HTTPS);
    expect(csp.ruleId).toEqual('xcto');
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
    it('contains x-content-type-options', (done) => {
      csp.handle({ 'x-content-type-options': true })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
  });
});
