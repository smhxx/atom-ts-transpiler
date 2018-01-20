import '../helper';
import fixtures from '../fixtures';
import Transpiler from '../../src/Transpiler';

describe('Transpiler', () => {

  describe('.resolve()', () => {

    it('returns the project\'s local TypeScript transpiler module', () => {
      const fixture = fixtures.goodPackage;
      const resolved = Transpiler.resolve(fixture.index.directory);
      expect(resolved).to.be.an('object');
      expect(resolved).to.equal(fixture.typescript.module);
    });

    it('traverses the directory structure to search in parent directories', () => {
      const fixture = fixtures.goodPackage;
      const resolved = Transpiler.resolve(fixture.deep.directory);
      expect(resolved).to.be.an('object');
      expect(resolved).to.equal(fixture.typescript.module);
    });

    it('writes an error to console and returns null if there is no typescript package', () => {
      const error = stub(console, 'error');

      const fixture = fixtures.noTranspilerPackage;
      const resolved = Transpiler.resolve(fixture.index.directory);
      expect(resolved).to.be.null;

      error.restore();
    });
  });
});
