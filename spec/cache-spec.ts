import Cache from '../src/cache';
import { fixtures } from './fixtures/fixtures';

describe('cache.ts', () => {

  describe('get()', () => {

    it('returns the resolved config and transpiler module for the given directory', () => {
      const fixture = fixtures.goodPackage;
      const entry = Cache.get(fixture.index.path);
      expect(entry).toBeDefined();
      expect(entry.config).toEqual(fixture.config.json);
      expect(entry.transpiler).toEqual(fixture.typescript.module);
    });

    it('returns the previously cached information if it already exists for the directory', () => {
      const fixture = fixtures.goodPackage;
      Cache.get(fixture.index.path);
      const parseSpy = jest.spyOn(JSON, 'parse');
      const entry = Cache.get(fixture.other.path);
      expect(parseSpy).not.toBeCalled();
      expect(entry).toBeDefined();
      expect(entry.config).toEqual(fixture.config.json);
      expect(entry.transpiler).toEqual(fixture.typescript.module);
    });
  });
});
