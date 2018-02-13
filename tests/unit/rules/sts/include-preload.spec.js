'use strict';

const stsIncludePreload = require('../../../../src/rules/sts/include-preload');

describe('sts/include-prelaod rule', () => {
  describe('check setup', () => {
    test('ruleId sts/include-preload', () => {
      expect(stsIncludePreload.ruleId).toEqual('sts/include-preload');
    });
  });

  describe('check applies', () => {
    test('appliesTo is a function', () => {
      expect(typeof stsIncludePreload.appliesTo).toEqual('function');
    });

    test('appliesTo Fails', () => {
      expect(stsIncludePreload.appliesTo({})).toEqual(false);
    });

    test('appliesTo Passes', () => {
      expect(stsIncludePreload.appliesTo({ 'strict-transport-security': '' }))
        .toEqual(true);
    });
  });

  describe('#fail', () => {
    test('sts header does not include preload', (done) => {
      stsIncludePreload.handle({ 'strict-transport-security': '' })
        .then((result) => {
          expect(result).toEqual(false);
          done();
        });
    });
  });

  describe('#pass', () => {
    test('different', (done) => {
      stsIncludePreload.handle({ 'strict-transport-security': 'preload' })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
  });
});
