import '../helper';
import fixtures from '../fixtures';
import * as path from 'path';
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

  describe('.transpilerModule', () => {

    // tslint:disable-next-line max-line-length
    it('writes an error to console and returns null if the typescript module is not resolved', () => {
      const error = stub(console, 'error');
      const fixture = fixtures.noTranspilerPackage;
      const cache = Cache.get(fixture.index.path);

      expect(cache.transpilerModule).to.be.null;
      expect(error).to.have.been.calledOnce;

      error.restore();
    });

  });

  describe('.transpilerVersion', () => {

    // tslint:disable-next-line max-line-length
    it('writes an error to console and returns null if the typescript module is not resolved', () => {
      const error = stub(console, 'error');
      const fixture = fixtures.noTranspilerPackage;
      const cache = Cache.get(fixture.index.path);

      expect(cache.transpilerVersion).to.be.null;
      expect(error).to.have.been.calledOnce;

      error.restore();
    });

  });

});
