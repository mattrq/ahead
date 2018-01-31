'use strict';

const grades = require('./grades');

describe('grade', () => {
  it('check setup', () => {
    grades.forEach((grade) => {
      expect(typeof grade.name).toEqual('string');
      expect(typeof grade.colour).toEqual('string');
      expect(typeof grade.points).toEqual('number');
    });
  });
});
