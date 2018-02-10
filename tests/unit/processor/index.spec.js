'use strict';

const p = require('../../../src/processor');
// const constants = require('../../../src/constants');

describe('processor', () => {
  describe('#getPoints', () => {
    test('points should be 0 with empty array', () => {
      expect(p.getPoints([])).toEqual(0);
    });

    test('points should be 0 with empty no positive results', () => {
      expect(p.getPoints([
        { result: false, points: 0 },
      ])).toEqual(0);
    });

    test('points should be 0 with empty no positive results', () => {
      expect(p.getPoints([
        { result: true },
      ])).toEqual(0);
    });

    test('points should be 20', () => {
      expect(p.getPoints([
        { result: true, points: 10 },
        { result: true, points: 10 },
      ])).toEqual(20);
    });
  });

  // describe('#handleHeaders', () => {
  //   test('points should be 0 with empty array', () => {
  //     expect(p.handleHeaders([])).toEqual(0);
  //   });
  // });
});
