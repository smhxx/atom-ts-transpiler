import '../helper';
import fixtures from '../fixtures';
import * as path from 'path';
// re-require Transpiler to reset static class state for isolated testing
delete require.cache[require.resolve('../../src/Transpiler')];
import { Transpiler } from '../../src/Transpiler';

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

  describe('.module', () => {

    it('returns the typescript module located in the associated directory', () => {
      const fixture = fixtures.goodPackage;
      const transpiler = Transpiler.get(fixture.typescript.directory);
      expect(transpiler.module).to.equal(fixture.typescript.module);
    });

    it('returns null if the module could not be loaded', () => {
      const fixture = fixtures.badTranspilerPackage;
      const transpilerDir = path.join(fixture.index.directory, 'node_modules', 'typescript');
      const transpiler = Transpiler.get(transpilerDir);
      expect(transpiler.module).to.equal(null);

      expect(atom.notifications.addError).to.have.been.calledOnce;
    });

  });

  describe('.version', () => {

    it('returns the version number of the associated typescript package', () => {
      const fixture = fixtures.goodPackage;
      const transpiler = Transpiler.get(fixture.typescript.directory);
      expect(transpiler.version).to.equal(fixture.typescriptPackageJson.json.version);
    });

    it('returns null if the package.json could not be loaded', () => {
      const fixture = fixtures.badTranspilerPackage;
      const transpilerDir = path.join(fixture.index.directory, 'node_modules', 'typescript');
      const transpiler = Transpiler.get(transpilerDir);
      expect(transpiler.version).to.equal(null);

      expect(atom.notifications.addError).to.have.been.calledOnce;
    });

  });

});
