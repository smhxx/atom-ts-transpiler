import * as fs from 'fs';
import * as path from 'path';
import { resolveConfig, resolveTranspiler } from '../src/resolve';

describe('resolve.ts', () => {
  const filePath1 = path.resolve('spec/fixtures/index.ts');
  const filePath2 = path.resolve('spec/fixtures/some/deep/directory/structure/index.ts');

  describe('resolveConfig()', () => {
    const configBuffer = fs.readFileSync(path.resolve('spec/fixtures/tsconfig.json'));
    const configData = JSON.parse(configBuffer.toString());

    it('returns the contents of the project\'s tsconfig file', () => {
      const resolved = resolveConfig(filePath1);
      expect(resolved).toEqual(configData);
    });

    it('traverses the directory structure to search in parent directories', () => {
      const resolved = resolveConfig(filePath2);
      expect(resolved).toEqual(configData);
    });
  });

  describe('resolveTranspiler()', () => {
    const moduleDir = path.resolve('spec/fixtures/node_modules/typescript');
    const moduleData = require(moduleDir);

    it('returns the project\'s local TypeScript transpiler module', () => {
      const resolved = resolveTranspiler(filePath1);
      expect(resolved).toBe(moduleData);
    });

    it('traverses the directory structure to search in parent directories', () => {
      const resolved = resolveTranspiler(filePath2);
      expect(resolved).toBe(moduleData);
    });
  });
});
