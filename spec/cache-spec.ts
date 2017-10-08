import { getCache } from '../src/cache';
import { fixtures } from './fixtures/fixtures';

describe('cache.ts', () => {

  describe('getCache()', () => {

    it('returns the resolved config and transpiler module for the given directory', () => {
      const fixture = fixtures.goodPackage;
      const entry = getCache(fixture.index.path);
      expect(entry).toBeDefined();
      expect(entry.options).toEqual(fixture.config.json.compilerOptions);
      expect(entry.transpiler).toEqual(fixture.typescript.module);
    });

    it('returns the previously cached information if it already exists for the directory', () => {
      const fixture = fixtures.goodPackage;
      getCache(fixture.index.path);
      const parseSpy = jest.spyOn(JSON, 'parse');
      const entry = getCache(fixture.other.path);
      expect(parseSpy).not.toBeCalled();
      expect(entry).toBeDefined();
      expect(entry.options).toEqual(fixture.config.json.compilerOptions);
      expect(entry.transpiler).toEqual(fixture.typescript.module);
    });
  });
});
