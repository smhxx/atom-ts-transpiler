import Transpiler from '../src/Transpiler';
import { fixtures } from './fixtures/fixtures';

describe('resolve.ts', () => {

  describe('resolve()', () => {

    it('returns the project\'s local TypeScript transpiler module', () => {
      const fixture = fixtures.goodPackage;
      const resolved = Transpiler.resolve(fixture.index.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toBe(fixture.typescript.module);
    });

    it('traverses the directory structure to search in parent directories', () => {
      const fixture = fixtures.goodPackage;
      const resolved = Transpiler.resolve(fixture.deep.directory);
      expect(resolved).toBeDefined();
      expect(resolved).toBe(fixture.typescript.module);
    });

    it('writes an error to console and returns undefined if there is no typescript package', () => {
      const error = jest.spyOn(console, 'error');
      error.mockImplementation(() => void 0);
      const fixture = fixtures.noTranspilerPackage;
      const resolved = Transpiler.resolve(fixture.index.directory);
      expect(resolved).toBeNull();
      error.mockRestore();
    });
  });
});
