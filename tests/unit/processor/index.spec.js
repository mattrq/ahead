'use strict';

const p = require('../../../src/processor');
let rules = require('../../../src/rules');
const c = require('../../../src/constants');

describe('processor', () => {
  beforeAll(() => {
    rules = rules.map((rule) => {
      switch (rule.ruleId) {
        case 'cps': {
          return Object.assign(rule, { handle: jest.fn(() => Promise.resolve({})) });
        }
        case 'sts': {
          return Object.assign(rule, { ruleId: null });
        }
        default: {
          return rule;
        }
      }
    });
  });

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

  describe('#getApplicableRules', () => {
    test('no rules returns no rules', () => {
      expect(p.getApplicableRules({})).toEqual([]);
    });

    test('one rules returns a rule', () => {
      expect(p.getApplicableRules({ csp: c.LEVEL_WARN }).length).toEqual(1);
    });

    test('one rules returns no rule when level is off', () => {
      expect(p.getApplicableRules({ csp: c.LEVEL_OFF }).length).toEqual(0);
    });
  });

  // describe('#handleHeaders', () => {
  //   test('points should be 0 with empty array', () => {
  //     expect(p.handleHeaders([])).toEqual(0);
  //   });
  // });
});
