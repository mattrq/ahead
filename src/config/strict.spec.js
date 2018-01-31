'use strict';

const strict = require('./strict');
const rules = require('../rules');
const constants = require('../constants');

describe('strict config', () => {
  const ruleNames = rules.map(rule => rule.ruleId);
  const expected = [constants.LEVEL_WARN, constants.LEVEL_OFF, constants.LEVEL_ERROR];

  it('check setup for rules', () => {
    Object.keys(strict.rules).forEach((key) => {
      expect(ruleNames).toContain(key);
      expect(expected).toContain(strict.rules[key]);
    });
  });

  it('requires no grade', () => {
    expect(strict.requiredGrade).toEqual(null);
  });
});
