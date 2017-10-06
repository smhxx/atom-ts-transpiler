import * as assert from 'assert';
import * as fs from 'fs';
import * as path from 'path';

const baseDir = path.resolve('spec/fixtures/node_modules');

class FixtureFile {
  readonly path: string;
  readonly contents: string = '';
  readonly directory: string;
  readonly json: any;
  readonly module: any;

  constructor(fullDir: string, fileName: string) {
    this.path = path.resolve(fullDir, fileName);
    const stat = fs.lstatSync(this.path);
    assert(stat.isFile() || stat.isDirectory());

    if (stat.isFile()) {
      this.directory = fullDir;
      this.contents = fs.readFileSync(this.path).toString();
      if (fileName.match(/\.json$/)) {
        this.json = JSON.parse(this.contents);
        assert(typeof this.json !== 'undefined');
      }
    } else {
      this.directory = this.path;
      this.module = require(this.path);
    }
  }
}

function getFixtureFiles(dir: string, files: Readonly<Record<string,string>>) {
  const newFiles = {} as Record<string, FixtureFile>;
  const fullDir = path.resolve(baseDir, dir);
  newFiles.package = new FixtureFile(fullDir, 'package.json');
  for (const tag in files) {
    newFiles[tag] = new FixtureFile(fullDir, path.resolve(fullDir, files[tag]));
  }
  return Object.freeze(newFiles);
}

export namespace Fixtures {
  export const goodPackage = getFixtureFiles('good-package', {
    config: 'tsconfig.json',
    deep: 'some/deep/directory/structure/index.ts',
    index: 'index.ts',
    other: 'other.ts',
    typescript: 'node_modules/typescript',
  });
  export const noConfigPackage = getFixtureFiles('no-config-package', {
    index: 'index.ts',
    typescript: 'node_modules/typescript',
  });
  export const noTranspilerPackage = getFixtureFiles('no-ts-package', {
    config: 'tsconfig.json',
    index: 'index.ts',
  });
}
