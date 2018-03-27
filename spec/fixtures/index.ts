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
      if (/\.json$/.test(fileName)) {
        try {
          this.json = JSON.parse(this.contents);
          assert(typeof this.json !== 'undefined');
        } catch (err) { }
      }
    } else {
      this.directory = this.path;
      this.module = require(this.path);
    }
  }
}

type FixturePackage = Readonly<Record<string, FixtureFile>>;

function getFixtureFiles(dir: string, files: Readonly<Record<string,string>>): FixturePackage {
  const newFiles = {} as Record<string, FixtureFile>;
  const fullDir = path.resolve(baseDir, dir);
  newFiles.package = new FixtureFile(fullDir, 'package.json');
  for (const tag in files) {
    newFiles[tag] = new FixtureFile(fullDir, path.resolve(fullDir, files[tag]));
  }
  return Object.freeze(newFiles);
}

export default <Readonly<Record<string, FixturePackage>>> {
  badConfigPackage: getFixtureFiles('bad-config-package', {
    config: 'tsconfig.json',
    index: 'index.ts',
  }),
  goodPackage: getFixtureFiles('good-package', {
    config: 'tsconfig.json',
    deep: 'some/deep/directory/structure/index.ts',
    index: 'index.ts',
    other: 'other.ts',
    typescript: 'node_modules/typescript',
    typescriptPackageJson: 'node_modules/typescript/package.json',
  }),
  noConfigPackage: getFixtureFiles('no-config-package', {
    index: 'index.ts',
    typescript: 'node_modules/typescript',
  }),
  noTranspilerPackage: getFixtureFiles('no-ts-package', {
    config: 'tsconfig.json',
    index: 'index.ts',
  }),
  notInstalledPackage: getFixtureFiles('not-installed-package', {
    config: 'tsconfig.json',
    index: 'index.ts',
  }),
  commentedConfigPackage: getFixtureFiles('commented-config-package', {
    config: 'tsconfig.json',
    index: 'index.ts',
  }),
  extendedConfigPackage: getFixtureFiles('extended-config-package', {
    config: 'tsconfig.json',
    index: 'index.ts',
  }),
  circularExtensionPackage: getFixtureFiles('circular-extension-package', {
    config: 'tsconfig.json',
    index: 'index.ts',
  }),
};
