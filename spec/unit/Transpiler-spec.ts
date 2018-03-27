import '../helper';
import fixtures from '../fixtures';
import Transpiler from '../../src/Transpiler';

describe('Transpiler', () => {

  describe('.get()', () => {

    it('returns the transpiler found in the given directory', () => {
      const fixture = fixtures.goodPackage;
      const transpiler = Transpiler.get(fixture.typescript.directory);
      expect(transpiler).to.be.an('object');
      expect(transpiler.module).to.deep.equal(fixture.typescript.module);
      expect(transpiler.version).to.equal(fixture.typescriptPackageJson.json.version);
    });

  });

});
