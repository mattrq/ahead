'use strict';

const p = require('../../../src/processor');
let rules = require('../../../src/rules');
const c = require('../../../src/constants');

describe('processor', () => {
  const appliesTo = jest.fn(() => true);
  beforeAll(() => {
    rules = rules.map((rule) => {
      switch (rule.ruleId) {
        case 'cps': {
          return Object.assign(rule, { handle: jest.fn(() => Promise.resolve({})) });
        }
        case 'sts': {
          return Object.assign(rule, { ruleId: null });
        }
        case 'pkp': {
          return Object.assign(rule, { appliesTo: 1 });
        }
        case 'no-powered-by': {
          return Object.assign(rule, { appliesTo });
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

    test('one rules returns no rule when ruleId is missing', () => {
      expect(p.getApplicableRules({ pkp: c.LEVEL_WARN }).length).toEqual(0);
    });

    test('one rules returns when appliesTo is a function', () => {
      expect(p.getApplicableRules({ 'no-powered-by': c.LEVEL_WARN }).length).toEqual(1);
      expect(appliesTo).toBeCalled();
    });

    test('one rules returns rule when is secure', () => {
      expect(p.getApplicableRules({ xfo: c.LEVEL_WARN }, true).length).toEqual(1);
    });
  });

  describe('#handleHeaders', () => {
    test('no rules returns no rules', () => {
      expect(p.handleHeaders([], { rules: {} })).rejects.toThrow();
    });

    test('no rules returns no rules', () => {
      expect(p.handleHeaders([], {})).rejects.toThrow();
    });
  });

  // describe('#handleResults', () => {s
  // describe('#handleHeaders', () => {
  //   test('points should be 0 with empty array', () => {
  //     expect(p.handleHeaders([])).toEqual(0);
  //   });
  // });
});
