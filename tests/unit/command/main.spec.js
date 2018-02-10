'use strict';

const commander = require('commander');
const main = require('../../../src/command/main');
const { processor } = require('../../../src/processor');

jest.mock('../../../src/processor', () => ({
  processor: jest.fn(cfg =>
    (cfg.url.href === 'http://error.example.com/' ? Promise.reject(new Error('test')) : Promise.resolve())),
}));

jest.mock('commander', () => {
  let callback;
  const com = {
    callback: null,
    version: jest.fn().mockReturnThis(),
    arguments: jest.fn().mockReturnThis(),
    option: jest.fn().mockReturnThis(),
    action: jest.fn((call) => {
      callback = call;
      return com;
    }),
    parse: jest.fn((args) => {
      if (args.length >= 3 && callback) {
        switch (args[2]) {
          case 'http://1.example.com':
            com.grade = 'A';
            break;
          case 'http://2.example.com':
            com.grade = null;
            break;
          default:
            break;
        }
        return callback(args[2]);
      }
      return com;
    }),
    help: jest.fn(),
    ruleset: 'securityheaders',
    timeout: 10,
    grade: 'A',
  };

  return com;
});

//

describe('Main', () => {
  beforeAll(() => {
    console.log = jest.fn(); // eslint-disable-line no-console
    console.error = jest.fn(); // eslint-disable-line no-console
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  describe('Fail', () => {
    test('No URL', (done) => {
      const p = {
        exit: jest.fn(),
        argv: [],
      };

      main(p).catch(() => {
        expect(commander.help).toBeCalled();
        expect(p.exit).toBeCalledWith(1);
        done();
      });
    });

    test('Bad URL', (done) => {
      const p = {
        exit: jest.fn(),
        argv: ['', '', '/Foo'],
      };

      main(p).catch(() => {
        expect(commander.help).toBeCalled();
        expect(p.exit).toBeCalledWith(1);
        done();
      });
    });

    test('Not HTTP/HTTPS', (done) => {
      const p = {
        exit: jest.fn(),
        argv: ['', '', 'mailto:test@example.com'],
      };

      main(p).catch(() => {
        expect(commander.help).toBeCalled();
        expect(p.exit).toBeCalledWith(1);
        done();
      });
    });

    test('Cannot fetch HTTP', (done) => {
      const p = {
        exit: jest.fn(),
        argv: ['', '', 'http://error.example.com'],
      };
      main(p).catch(() => {
        expect(p.exit).toBeCalledWith(1);
        done();
      });
    });
  });

  describe('Pass', () => {
    test('Try A', (done) => {
      const p = {
        exit: jest.fn(),
        argv: ['', '', 'http://1.example.com'],
      };
      main(p).then(() => {
        expect(processor).toBeCalled();
        expect(p.exit).not.toBeCalled();
        done();
      });
    });

    test('Try B', (done) => {
      const p = {
        exit: jest.fn(),
        argv: ['', '', 'http://2.example.com'],
      };
      main(p).then(() => {
        expect(processor).toBeCalled();
        expect(p.exit).not.toBeCalled();
        done();
      });
    });
  });
});
