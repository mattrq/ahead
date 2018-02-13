'use strict';

const { getGrade, hasFailed } = require('../../../src/helpers/grade');

describe('auth action creators', () => {
  describe('#hasFailed', () => {
    it('80 Points should pass', () => {
      expect(hasFailed(80, 'B')).toEqual(false);
    });
    it('60 Points should pass', () => {
      expect(hasFailed(60, 'B')).toEqual(false);
    });
    it('59 Points should fail', () => {
      expect(hasFailed(59, 'B')).toEqual(true);
    });
    it('Grade of H should fail', () => {
      expect(hasFailed(59, 'H')).toEqual(true);
    });
  });

  describe('#getGrade', () => {
    it('80 Points should be A', () => {
      expect(getGrade(75)).toEqual({ colour: 'green', name: 'A', points: 75 });
    });
    it('65 Points should be B', () => {
      expect(getGrade(64)).toEqual({ colour: 'yellow', name: 'B', points: 60 });
    });
    it('60 Points should be B', () => {
      expect(getGrade(60)).toEqual({ colour: 'yellow', name: 'B', points: 60 });
    });
    it('59 Points should fail', () => {
      expect(getGrade(59)).toEqual({ colour: 'yellow', name: 'C', points: 50 });
    });
  });
});
