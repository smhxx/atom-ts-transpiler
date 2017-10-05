import * as fs from 'fs';
import * as path from 'path';
import { getCache } from '../src/cache';

const projectBase = path.resolve('spec/fixtures/node_modules/good-package');

describe('cache.ts', () => {
  const configBuffer = fs.readFileSync(path.resolve(projectBase, 'tsconfig.json'));
  const configData = JSON.parse(configBuffer.toString());
  const moduleDir = path.resolve(projectBase, 'node_modules/typescript');
  const moduleData = require(moduleDir);

  describe('getCache()', () => {
    it('returns the resolved config and transpiler module for the given directory', () => {
      const entry = getCache(path.resolve(projectBase, 'index.js'));
      expect(entry).toBeDefined();
      expect(entry.config).toEqual(configData);
      expect(entry.transpiler).toEqual(moduleData);
    });

    it('returns the previously cached information if it already exists for the directory', () => {
      getCache(path.resolve(projectBase, 'index.js'));
      const parseSpy = jest.spyOn(JSON, 'parse');
      const entry = getCache(path.resolve(projectBase, 'other.js'));
      expect(parseSpy).not.toBeCalled();
      expect(entry).toBeDefined();
      expect(entry.config).toEqual(configData);
      expect(entry.transpiler).toEqual(moduleData);
    });
  });
});
