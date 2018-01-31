'use strict';

const securityheaders = require('./securityheaders');
const rules = require('../rules');
const constants = require('../constants');

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
