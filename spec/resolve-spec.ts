import { resolveConfig, resolveTranspiler } from '../src/resolve';
import { fixtures } from './fixtures/fixtures';

describe('resolve.ts', () => {

  describe('resolveOptions()', () => {

    it('returns the contents of the project\'s tsconfig file', () => {
      const fixture = fixtures.goodPackage;
      const resolved = resolveConfig(fixture.index.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual(fixture.config.json.compilerOptions);
    });

    it('traverses the directory structure to search in parent directories', () => {
      const fixture = fixtures.goodPackage;
      const resolved = resolveConfig(fixture.deep.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual(fixture.config.json.compilerOptions);
    });

    it('returns {} if the config file cannot be resolved', () => {
      const fixture = fixtures.noConfigPackage;
      const resolved = resolveConfig(fixture.index.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual({});
    });

    it('writes an error to console and returns {} if the resolved config file is invalid', () => {
      const error = jest.spyOn(console, 'error');
      error.mockImplementation(() => void 0);
      const fixture = fixtures.badConfigPackage;
      const resolved = resolveConfig(fixture.index.directory);
      expect(error).toHaveBeenCalledTimes(1);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual({});
      error.mockRestore();
    });

    it('returns {} if the config\'s compilerOptions do not exist or are not an object', () => {
      const fixture = fixtures.noOptionsPackage;
      const resolved = resolveConfig(fixture.index.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual({});
    });

    it('allows comments in the config', () => {
      const fixture = fixtures.commentedConfigPackage;
      const resolved = resolveConfig(fixture.index.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual({
        module: 'commonjs',
        target: 'es2017',
      });
    });

    it('supports config inheritance', () => {
      const fixture = fixtures.extendedConfigPackage;
      const resolved = resolveConfig(fixture.index.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual(
        Object.assign({}, fixtures.goodPackage.config.json.compilerOptions, {
          module: 'commonjs',
          target: 'es2017',
        }),
      );
    });

    it('fails gracefully if there is a circular extension pattern', () => {
      const error = jest.spyOn(console, 'error');
      error.mockImplementation(() => void 0);
      const fixture = fixtures.circularExtensionPackage;
      const resolved = resolveConfig(fixture.index.directory);
      expect(error).toHaveBeenCalled();
      expect(resolved).toEqual(fixture.config.json.compilerOptions);
      error.mockRestore();
    });
  });

  describe('resolveTranspiler()', () => {

    it('returns the project\'s local TypeScript transpiler module', () => {
      const fixture = fixtures.goodPackage;
      const resolved = resolveTranspiler(fixture.index.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toBe(fixture.typescript.module);
    });

    it('traverses the directory structure to search in parent directories', () => {
      const fixture = fixtures.goodPackage;
      const resolved = resolveTranspiler(fixture.deep.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toBe(fixture.typescript.module);
    });

    it('writes an error to console and returns undefined if there is no typescript package', () => {
      const error = jest.spyOn(console, 'error');
      error.mockImplementation(() => void 0);
      const fixture = fixtures.noTranspilerPackage;
      const resolved = resolveTranspiler(fixture.index.directory);
      expect(resolved).toBeUndefined();
      error.mockRestore();
    });
  });
});
