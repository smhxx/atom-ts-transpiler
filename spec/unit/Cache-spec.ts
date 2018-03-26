import '../helper';
import fixtures from '../fixtures';
import Cache from '../../src/Cache';
import Config from '../../src/Config';

describe('Cache', () => {

  describe('.get()', () => {

    it('returns the resolved config and transpiler module for the given directory', () => {
      const fixture = fixtures.goodPackage;
      const entry = Cache.get(fixture.index.path);
      expect(entry).to.be.an('object');
      expect(entry.config).to.deep.equal(fixture.config.json);
      expect(entry.transpilerModule).to.equal(fixture.typescript.module);
      expect(entry.transpilerVersion).to.equal(fixture.typescriptPackageJson.json.version);
    });

    it('returns the previously cached information if it already exists for the directory', () => {
      const fixture = fixtures.goodPackage;
      Cache.get(fixture.index.path);

      const resolve = spy(Config, 'resolve');
      const entry = Cache.get(fixture.other.path);
      expect(resolve).not.to.have.been.called;
      expect(entry).to.be.an('object');
      expect(entry.config).to.deep.equal(fixture.config.json);
      expect(entry.transpilerModule).to.equal(fixture.typescript.module);
      expect(entry.transpilerVersion).to.equal(fixture.typescriptPackageJson.json.version);

      resolve.restore();
    });
  });
});
