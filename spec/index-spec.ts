import * as path from 'path';
import { getCacheKeyData, transpile } from '../src/index';
import { Fixtures } from './fixtures/fixtures';
import { Options, PackageMeta, TsConfig } from '../src/defs';

describe('atom-ts-transpiler', () => {

  describe('getCacheKeyData()', () => {

    const meta:PackageMeta = {
      name: 'good-package',
      path: Fixtures.goodPackage.package.directory,
      meta: Fixtures.goodPackage.package.json,
    };

    it('returns the concatenated contents of the listed cacheKeyFiles', () => {
      const fixture = Fixtures.goodPackage;
      const cacheKeyFiles = [
        'index.ts',
        'other.ts',
      ];
      const config = Object.assign({}, fixture.config.json, { cacheKeyFiles });
      const data: string = getCacheKeyData('', '', config, meta);
      expect(data).not.toEqual('');
      expect(data).toMatch(fixture.index.contents);
      expect(data).toMatch(fixture.other.contents);
    });

    it('returns empty string if no cacheKeyFiles are specified', () => {
      const fixture = Fixtures.goodPackage;
      const data: string = getCacheKeyData('', '', fixture.config.json, meta);
      expect(data).toEqual('');
    });
  });

  describe('transpile()', () => {

    const fixture = Fixtures.goodPackage;
    const spy = fixture.typescript.module.transpileModule = jest.fn();

    beforeEach(() => {
      spy.mockReset();
      spy.mockImplementation(() => ({
        diagnostics: [],
        outputText: 'output',
      }));
    });

    afterAll(() => {
      delete fixture.typescript.module.transpileModule;
    });

    it('calls the appropriate transpiler with the contents of the source file', () => {
      transpile('', fixture.index.path, {});
      expect(spy).toHaveBeenCalledTimes(1);
      const source = spy.mock.calls[0][0];
      expect(source).toEqual(fixture.index.contents);
    });

    it('writes any encountered errors to console.error() and does not return any code', () => {
      const error = jest.spyOn(console, 'error');
      error.mockImplementation(() => void 0);
      spy.mockImplementationOnce(() => {
        throw new Error('the message attached to the thrown error');
      });

      const output = transpile('', fixture.index.path, {});
      expect(error).toHaveBeenCalledTimes(1);
      expect(typeof error.mock.calls[0][0]).toBe('string');
      expect(error.mock.calls[0][0]).toMatch(/the message attached to the thrown error/);
      expect(typeof output).toBe('object');
      expect(output.code).toBeUndefined();

      error.mockRestore();
    });

    it('uses the compiler options specified in tsconfig.json', () => {
      transpile('', fixture.index.path, {});
      expect(spy).toHaveBeenCalledTimes(1);
      const usedOptions = spy.mock.calls[0][1].compilerOptions;
      expect(usedOptions.removeComments).toBe(true);
    });

    it('overrides the tsconfig options with any specified in the package.json', () => {
      const compilerOptions: TsConfig.CompilerOptions = { removeComments: false };
      const options: Options = { compilerOptions };
      transpile('', fixture.index.path, options);
      expect(spy).toHaveBeenCalledTimes(1);
      const usedOptions = spy.mock.calls[0][1].compilerOptions;
      expect(usedOptions.removeComments).toBe(false);
    });

    it('writes an error to console and returns no code if the file does not exist', () => {
      const error = jest.spyOn(console, 'error');
      error.mockImplementation(() => void 0);
      const filePath = path.resolve(fixture.index.directory, 'not-a-real-file.ts');
      const output = transpile('', filePath, {});
      expect(error).toHaveBeenCalledTimes(1);
      expect(error.mock.calls[0][0]).toMatch(/ENOENT/);
      expect(output).toEqual({});
      error.mockRestore();
    });

    it('returns no code if the typescript package could not be resolved', () => {
      const error = jest.spyOn(console, 'error');
      error.mockImplementation(() => void 0);
      const output = transpile('', Fixtures.noTranspilerPackage.index.path, {});
      expect(error).toHaveBeenCalledTimes(1);
      expect(output).toEqual({});
      error.mockRestore();
    });
  });
});
