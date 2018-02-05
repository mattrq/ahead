'use strict';

const csp = require('../../../src/rules/xfo');
const constants = require('../../../src/constants');

describe('xfo rule', () => {
  describe('check setup', () => {
    expect(csp.appliesTo).toEqual(constants.HTTP_HTTPS);
    expect(csp.ruleId).toEqual('xfo');
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
    it('contains x-frame-options', (done) => {
      csp.handle({ 'x-frame-options': true })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
  });
});
