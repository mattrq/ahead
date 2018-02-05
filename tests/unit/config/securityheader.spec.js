'use strict';

const securityheaders = require('../../../src/config/securityheaders');
const rules = require('../../../src/rules/index');
const constants = require('../../../src/constants');

describe('securityheaders config', () => {
  const ruleNames = rules.map(rule => rule.ruleId);
  const expected = [constants.LEVEL_WARN, constants.LEVEL_OFF];

  it('check setup for rules', () => {
    Object.keys(securityheaders.rules).forEach((key) => {
      expect(ruleNames).toContain(key);
      expect(expected).toContain(securityheaders.rules[key]);
    });
  });

  it('requires a grade of B', () => {
    expect(securityheaders.requiredGrade).toEqual('B');
  });
});
