'use strict';

const xmlEscape = require('../../../src/helpers/xml-escape');

describe('xmlEscape Helper', () => {
  test('test', () => {
    expect(xmlEscape('"><&\'§ This should not be escaped'))
      .toEqual('&quot;&gt;&lt;&amp;&apos;&#167; This should not be escaped');
  });
});
