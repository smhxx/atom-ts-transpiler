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
