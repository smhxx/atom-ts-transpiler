import { resolveConfig, resolveTranspiler } from '../src/resolve';
import { Fixtures } from './fixtures/fixtures';

describe('resolve.ts', () => {

  describe('resolveOptions()', () => {

    it('returns the contents of the project\'s tsconfig file', () => {
      const fixture = Fixtures.goodPackage;
      const resolved = resolveConfig(fixture.index.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual(fixture.config.json.compilerOptions);
    });

    it('traverses the directory structure to search in parent directories', () => {
      const fixture = Fixtures.goodPackage;
      const resolved = resolveConfig(fixture.deep.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual(fixture.config.json.compilerOptions);
    });

    it('returns {} if the config file cannot be resolved', () => {
      const fixture = Fixtures.noConfigPackage;
      const resolved = resolveConfig(fixture.index.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual({});
    });

    it('writes an error to console and returns {} if the resolved config file is invalid', () => {
      const error = jest.spyOn(console, 'error');
      error.mockImplementation(() => void 0);
      const fixture = Fixtures.badConfigPackage;
      const resolved = resolveConfig(fixture.index.directory);
      expect(error).toHaveBeenCalledTimes(1);
      expect(resolved).toBeDefined();
      expect(resolved).toEqual({});
    });
  });

  describe('resolveTranspiler()', () => {

    it('returns the project\'s local TypeScript transpiler module', () => {
      const fixture = Fixtures.goodPackage;
      const resolved = resolveTranspiler(fixture.index.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toBe(fixture.typescript.module);
    });

    it('traverses the directory structure to search in parent directories', () => {
      const fixture = Fixtures.goodPackage;
      const resolved = resolveTranspiler(fixture.deep.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toBe(fixture.typescript.module);
    });
  });
});
