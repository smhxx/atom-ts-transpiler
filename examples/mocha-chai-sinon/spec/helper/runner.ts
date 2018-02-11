import { createRunner } from 'atom-mocha-test-runner';
import * as fs from 'fs';
import * as path from 'path';

const packageName: string = require('../../package.json').name;

const runner = createRunner(
  {
    colors: process.platform !== 'win32' || !!process.env.MSYSTEM,
    htmlTitle: `${packageName} tests (PID ${process.pid})`,
    reporter: process.env.MOCHA_REPORTER || 'spec',
    testSuffixes: ['spec.ts'],
  },
  (mocha) => {
    // Create symlink between package and temp packages directory
    const packagesDir = atom.packages.getPackageDirPaths()
      .find(p => p.match(/[\\\/]dev[\\\/]packages$/) !== null);
    if (packagesDir !== undefined) {
      const packagesDirTokens = packagesDir.split(path.sep);
      try {
        let partialPath = path.resolve(packagesDirTokens.shift() + path.sep);
        while (packagesDirTokens.length > 0) {
          partialPath = path.join(partialPath, packagesDirTokens.shift() as string);
          if (!fs.existsSync(partialPath)) {
            fs.mkdirSync(partialPath);
          }
        }
        const srcPath = path.resolve(__dirname, '../../');
        const destPath = path.join(packagesDir, packageName);
        fs.symlinkSync(
          srcPath,
          destPath,
          'junction',
        );
      } catch (err) {
        const newErr = new Error(
          `Unable to link package to temp directory. The error thrown was:\n\n${err.message}`,
        );
        newErr.stack = err.stack;
        throw newErr;
      }
    }
    
    // Assign timeout option
    mocha.timeout(parseInt(process.env.MOCHA_TIMEOUT || '1000', 10));

    // Handle reporting for CI environments
    if (process.env.TEST_JUNIT_XML_PATH) {
      mocha.reporter(require('mocha-junit-and-console-reporter'), {
        mochaFile: process.env.TEST_JUNIT_XML_PATH,
      });
    } else if (process.env.APPVEYOR_API_URL) {
      mocha.reporter(require('mocha-appveyor-reporter'));
    } else if (process.env.CIRCLECI === 'true') {
      const circleReports = process.env.CIRCLE_TEST_REPORTS;
      if (circleReports) {
        mocha.reporter(require('mocha-junit-and-console-reporter'), {
          mochaFile: path.join(circleReports, 'mocha', 'test-results.xml'),
        });
      }
    }
  },
);

export = runner;
