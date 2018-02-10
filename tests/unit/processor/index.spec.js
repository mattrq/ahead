'use strict';

const p = require('../../../src/processor');
// const constants = require('../../../src/constants');

describe('processor', () => {
  describe('#getPoints', () => {
    test('points should be 0 with empty array', () => {
      expect(p.getPoints([])).toEqual(0);
    });
  });
});
