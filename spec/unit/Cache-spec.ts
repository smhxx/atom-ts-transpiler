import '../helper';
import fixtures from '../fixtures';
// re-require Cache to reset static class state
delete require.cache[require.resolve('../../src/Cache')];
import { Cache } from '../../src/Cache';
import { Transpiler } from '../../src/Transpiler';

describe('Cache', () => {

  describe('.get()', () => {

    it('returns an instance of the Cache class corresponding to the given directory', () => {
      const fixture = fixtures.goodPackage;
      const entry = Cache.get(fixture.index.path);
      expect(entry.dir).to.equal(fixture.index.directory);
    });

  });

  describe('.config', () => {

    it('returns the contents of the package\'s package.json file', () => {
      const fixture = fixtures.goodPackage;
      const entry = Cache.get(fixture.index.path);
      expect(entry.config).to.deep.equal(fixture.config.json);
    });

    it('returns an empty object if the package.json could not be found', () => {
      const fixture = fixtures.noConfigPackage;
      const entry = Cache.get(fixture.index.path);
      expect(entry.config).to.deep.equal({});
    });

  });

  describe('.transpiler', () => {

    // tslint:disable-next-line max-line-length
    it('returns an instance of the Transpiler class corresponding to the correct TypeScript package', () => {
      const fixture = fixtures.goodPackage;
      const entry = Cache.get(fixture.index.path);
      const transpiler = entry.transpiler;
      expect(transpiler).to.be.an('object');
      expect((transpiler as Transpiler).dir).to.equal(fixture.typescript.directory);
    });

  });

});
