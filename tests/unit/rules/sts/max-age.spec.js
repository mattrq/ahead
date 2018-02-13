'use strict';

const stsMaxAge = require('../../../../src/rules/sts/max-age');

describe('sts/include-prelaod rule', () => {
  describe('check setup', () => {
    test('ruleId sts/max-age', () => {
      expect(stsMaxAge.ruleId).toEqual('sts/max-age');
    });
  });

  describe('check applies', () => {
    test('appliesTo is a function', () => {
      expect(typeof stsMaxAge.appliesTo).toEqual('function');
    });

    test('appliesTo Fails', () => {
      expect(stsMaxAge.appliesTo({})).toEqual(false);
    });

    test('appliesTo Passes', () => {
      expect(stsMaxAge.appliesTo({ 'strict-transport-security': '' }))
        .toEqual(true);
    });
  });

  describe('#fail', () => {
    test('sts header does not include max-age', (done) => {
      stsMaxAge.handle({ 'strict-transport-security': '' })
        .then((result) => {
          expect(result).toEqual(false);
          done();
        });
    });
    test('max-age 1second less than 1 year', (done) => {
      stsMaxAge.handle({ 'strict-transport-security': ' max-age=31535999' })
        .then((result) => {
          expect(result).toEqual(false);
          done();
        });
    });
  });

  describe('#pass', () => {
    test('max-age 1 year', (done) => {
      stsMaxAge.handle({ 'strict-transport-security': ' max-age=31536000' })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });

    test('max-age very large', (done) => {
      stsMaxAge.handle({ 'strict-transport-security': ' max-age=1000000000;' })
        .then((result) => {
          expect(result).toEqual(true);
          done();
        });
    });
  });
});
