'use strict';

const p = require('../../../src/processor');
let rules = require('../../../src/rules');
const c = require('../../../src/constants');
const output = require('../../../src/formatter/stylish');
const fetch = require('node-fetch');
const { URL } = require('url');

jest.mock('../../../src/formatter/stylish', () => jest.fn());
jest.mock('node-fetch', () => jest.fn((url) => {
  if (url === 'http://localhost/fail') {
    const err = new Error('Fail');
    err.name = 'FetchError';
    return Promise.reject(err);
  }

  return Promise.resolve({
    headers: {
      raw: () => ({
        'content-security-policy': 'default-src: \'none\';',
      }),
    },
  });
}));

describe('processor', () => {
  const appliesTo = jest.fn(() => true);
  const handle = jest.fn(() => Promise.resolve({ result: true }));

  beforeAll(() => {
    rules = rules.map((rule) => {
      switch (rule.ruleId) {
        case 'csp': {
          return Object.assign(rule, { handle });
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

  afterEach(() => {
    jest.clearAllMocks();
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
    describe('fail', () => {
      test('no rules returns no rules', () => {
        expect(p.handleHeaders([], { rules: {} })).rejects.toThrow();
      });

      test('no rules returns no rules', () => {
        expect(p.handleHeaders([], {})).rejects.toThrow();
      });
    });

    describe('pass', () => {
      test('no rules returns no rules', (done) => {
        p.handleHeaders({ 'content-type': 'text/plain' }, { rules: { csp: c.LEVEL_WARN } })
          .then(() => {
            expect(handle).toBeCalled();
            done();
          });
      });
    });
  });

  describe('#handleResults', () => {
    describe('fail', () => {
      beforeAll(() => {
        process.exit = jest.fn();
        p.getPoints = jest.fn(() => 1);
      });

      test('config with require grade', () => {
        p.handleResults([], { requiredGrade: 'A' });
        expect(process.exit).toHaveBeenCalledWith(1);
      });

      test('results with errors', () => {
        p.handleResults([{
          level: c.LEVEL_ERROR,
        }], { });
        expect(output).toBeCalled();
        expect(process.exit).toHaveBeenCalledWith(1);
      });
    });

    describe('pass', () => {
      beforeAll(() => {
        process.exit = jest.fn();
      });

      test('no fail', () => {
        p.handleResults([{
          level: c.LEVEL_WARN,
          result: true,
          points: 1000,
        }], { requiredGrade: 'A' });
        expect(process.exit).not.toBeCalled();
      });

      test('no fail', () => {
        p.handleResults([{
          level: c.LEVEL_WARN,
          result: true,
        }], { });
        expect(output).toBeCalled();
        expect(process.exit).not.toBeCalled();
      });
    });
  });
  describe('#processor', () => {
    describe('errors', () => {
      test('bad endpoint', () => {
        expect(p.processor({ url: new URL('http://localhost/fail') })).rejects.toThrowError();
        expect(fetch).toBeCalled();
      });

      test('no rules', () => {
        expect(p.processor({ url: new URL('http://localhost/') })).rejects.toThrowError();
        expect(fetch).toBeCalled();
      });
    });

    describe('runs', () => {
      test('no rules', () => {
        expect(p.processor({
          url: new URL('http://localhost/'),
          rules: {
            csp: c.LEVEL_WARN,
          },
        })).rejects.toThrowError();
        expect(fetch).toBeCalled();
      });
    });
  });
});
