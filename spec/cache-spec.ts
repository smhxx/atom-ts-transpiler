import * as fs from 'fs';
import * as path from 'path';
import { getCache } from '../src/cache';

describe('cache.ts', () => {
  const configBuffer = fs.readFileSync(path.resolve('spec/fixtures/tsconfig.json'));
  const configData = JSON.parse(configBuffer.toString());
  const moduleDir = path.resolve('spec/fixtures/node_modules/typescript');
  const moduleData = require(moduleDir);

  describe('getCache()', () => {
    it('returns the resolved config and transpiler module for the given directory', () => {
      const entry = getCache(path.resolve('spec/fixtures/index.js'));
      expect(entry).toBeDefined();
      expect(entry.config).toEqual(configData);
      expect(entry.transpiler).toEqual(moduleData);
    });

    it('returns the previously cached information if it already exists for the directory', () => {
      getCache(path.resolve('spec/fixtures/index.js'));
      const parseSpy = jest.spyOn(JSON, 'parse');
      const entry = getCache(path.resolve('spec/fixtures/other.js'));
      expect(parseSpy).not.toBeCalled();
      expect(entry).toBeDefined();
      expect(entry.config).toEqual(configData);
      expect(entry.transpiler).toEqual(moduleData);
    });
  });
});
