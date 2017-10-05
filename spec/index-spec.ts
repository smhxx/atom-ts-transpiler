import * as fs from 'fs';
import * as path from 'path';
import { getCacheKeyData, transpile } from '../src/index';

const projectBase = path.resolve('spec/fixtures/node_modules/good-package');

describe('atom-ts-transpiler', () => {
  const filePath1 = path.resolve(projectBase, 'index.ts');
  const filePath2 = path.resolve(projectBase, 'some/deep/directory/structure/index.ts');
  const fileContents1 = fs.readFileSync(filePath1).toString();
  const fileContents2 = fs.readFileSync(filePath2).toString();

  describe('getCacheKeyData()', () => {
    const pkgData = fs.readFileSync(path.resolve(projectBase, 'package.json'));
    const pkg = {
      meta: JSON.parse(pkgData.toString()),
      name: 'mock-typescript',
      path: projectBase,
    };
    const config = {
      glob: '**/*.{ts,tsx}',
      transpiler: '',
    };
    const cacheKeyFiles = [
      'index.ts',
      'some/deep/directory/structure/index.ts',
    ];

    it('returns empty string if no cacheKeyFiles are specified', () => {
      const data: string = getCacheKeyData('', '', config, pkg);
      expect(data).toEqual('');
    });

    it('returns the concatenated contents of the listed cacheKeyFiles', () => {
      const configWithFiles = Object.assign({}, config, { cacheKeyFiles });
      const data: string = getCacheKeyData('', '', configWithFiles, pkg);
      expect(data).not.toEqual('');
      expect(data).toMatch(fileContents1);
      expect(data).toMatch(fileContents2);
    });
  });

  describe('transpile()', () => {
    const mock = require(path.resolve(projectBase, 'node_modules/typescript/mock.ts'));
    const transpileModule = jest.spyOn(mock, 'transpileModule');

    afterEach(() => {
      transpileModule.mockReset();
    });

    afterAll(() => {
      transpileModule.mockRestore();
    });

    it('calls the appropriate transpiler with the contents of the source file', () => {
      transpile('', filePath1);
      expect(transpileModule).toHaveBeenCalledTimes(1);
      const source = transpileModule.mock.calls[0][0];
      expect(source).toEqual(fileContents1);
    });

    it('writes any encountered errors to console.error() and does not return any code', () => {
      const spy = jest.spyOn(console, 'error').mockImplementation(() => undefined);
      const output = transpile('', filePath1);
      expect(spy).toHaveBeenCalledTimes(1);
      expect(typeof output).toBe('object');
      expect(output.code).toBeUndefined();
    });

    it('uses the compiler options specified in tsconfig.json', () => {
      transpile('', filePath1);
      expect(transpileModule).toHaveBeenCalledTimes(1);
      const options = transpileModule.mock.calls[0][1].compilerOptions;
      expect(options.removeComments).toBe(true);
    });

    it('overrides the tsconfig options with any specified in the package.json', () => {
      transpile('', filePath1, { removeComments: false });
      expect(transpileModule).toHaveBeenCalledTimes(1);
      const options = transpileModule.mock.calls[0][1].compilerOptions;
      expect(options.removeComments).toBe(false);
    });
  });
});
