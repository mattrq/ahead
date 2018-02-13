'use strict';

const stsIncludeSubdomains = require('../../../../src/rules/sts/include-subdomains');

describe('sts/include-subdomains rule', () => {
  describe('check setup', () => {
    test('ruleId sts/include-subdomains', () => {
      expect(stsIncludeSubdomains.ruleId).toEqual('sts/include-subdomains');
    });
  });

  describe('check applies', () => {
    test('appliesTo is a function', () => {
      expect(typeof stsIncludeSubdomains.appliesTo).toEqual('function');
    });

    test('appliesTo Fails', () => {
      expect(stsIncludeSubdomains.appliesTo({})).toEqual(false);
    });

    test('appliesTo Passes', () => {
      expect(stsIncludeSubdomains.appliesTo({ 'strict-transport-security': '' }))
        .toEqual(true);
    });
  });

  describe('#fail', () => {
    test('sts header does not include preload', (done) => {
      stsIncludeSubdomains.handle({ 'strict-transport-security': '' })
        .then((result) => {
          expect(result).toEqual(false);
          done();
        });
    });
  });

  describe('#pass', () => {
    test('Simple', (done) => {
      stsIncludeSubdomains.handle({ 'strict-transport-security': ' includeSubDomains' })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
    test('End with ;', (done) => {
      stsIncludeSubdomains.handle({ 'strict-transport-security': ' includeSubDomains;' })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
    test('Start and Ends with ;', (done) => {
      stsIncludeSubdomains.handle({ 'strict-transport-security': ';includeSubDomains;' })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
  });
});
