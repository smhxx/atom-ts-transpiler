/* eslint-disable no-console */
const cp = require('child_process');
const fs = require('fs');
const path = require('path');

const dirs = fs.readdirSync('./examples').filter(s => fs.statSync(`examples/${s}`).isDirectory());
const run = (args, dir) => {
  const child = cp.spawnSync('npm', args, { shell: true, cwd: path.resolve(`examples/${dir}`) });
  if (child.error) {
    throw child.error;
  }
  if (child.status !== 0) {
    throw child.stderr;
  }
};

dirs.forEach((dir) => {
  console.log(`Verifying example project "${dir}":\n  Installing dependencies...`);
  run(['install'], dir);
  console.log('  Running tslint...');
  run(['run', 'lint'], dir);
  if (dir !== 'simple') {
    console.log('  Running tests...');
    run(['test'], dir);
  }
  console.log('  Linter and tests passed.\n');
});
