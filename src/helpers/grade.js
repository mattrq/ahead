'use strict';

/* eslint no-console:off */

const grades = require('../config/grades');
const constants = require('../constants');

const hasFailed = (points, minGrade) => {
  const matchingGrade = grades.filter(grade => grade.name === minGrade).pop();
  if (matchingGrade) {
    return points < matchingGrade.points;
  }
  return true;
};

const getGrade = points =>
  (grades.filter(grade => (points >= grade.points || grade.points === 0)).shift());

const getApplicableRules = (rulesToApply, secure, rules) => (
  rules.filter((rule) => {
    if (!rule.ruleId || typeof rule.handle !== 'function' || !rule.appliesTo) {
      return false;
    }

    if (rule.appliesTo === (secure ? constants.HTTP_ONLY : constants.HTTPS_ONLY)) {
      return false;
    }

    return (
      rule.ruleId in rulesToApply &&
      rulesToApply[rule.ruleId] !== constants.LEVEL_OFF
    );
  })
);


module.exports = {
  getGrade,
  hasFailed,
  getApplicableRules,
};
