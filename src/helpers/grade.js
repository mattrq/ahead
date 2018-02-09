'use strict';

/* eslint no-console:off */

const grades = require('../config/grades');

const hasFailed = (points, minGrade) => {
  const matchingGrade = grades
    .filter(grade => grade.name === minGrade)
    .pop();

  if (matchingGrade) {
    return points < matchingGrade.points;
  }

  return true;
};

const getGrade = points =>
  (grades.filter(grade => (points >= grade.points || grade.points === 0)).shift());

module.exports = {
  getGrade,
  hasFailed,
};
