import '../helper';
import fixtures from '../fixtures';
import Config from '../../src/Config';

describe('resolve.ts', () => {

  describe('resolveConfig()', () => {

    it('returns the contents of the project\'s tsconfig file', () => {
      const fixture = fixtures.goodPackage;
      const resolved = Config.resolve(fixture.index.directory);
      expect(resolved).to.be.an('object');
      expect(resolved).to.deep.equal(fixture.config.json);
    });

    it('traverses the directory structure to search in parent directories', () => {
      const fixture = fixtures.goodPackage;
      const resolved = Config.resolve(fixture.deep.directory);
      expect(resolved).to.be.an('object');
      expect(resolved).to.deep.equal(fixture.config.json);
    });

    it('returns {} if the config file cannot be resolved', () => {
      const fixture = fixtures.noConfigPackage;
      const resolved = Config.resolve(fixture.index.directory);
      expect(resolved).to.be.an('object');
      expect(resolved).to.deep.equal({});
    });

    it('writes an error to console and returns {} if the resolved config file is invalid', () => {
      const error = stub(console, 'error');

      const fixture = fixtures.badConfigPackage;
      const resolved = Config.resolve(fixture.index.directory);
      expect(error).to.have.been.calledOnce;
      expect(resolved).to.be.an('object');
      expect(resolved).to.deep.equal({});

      error.restore();
    });

    it('allows comments in the config', () => {
      const fixture = fixtures.commentedConfigPackage;
      const resolved = Config.resolve(fixture.index.directory);
      expect(resolved).to.be.an('object');
      expect(resolved).to.deep.equal({
        compilerOptions: {
          module: 'commonjs',
          target: 'es2017',
        },
      });
    });

    it('supports config inheritance', () => {
      const fixture = fixtures.extendedConfigPackage;
      const resolved = Config.resolve(fixture.index.directory);
      expect(resolved).to.be.an('object');
      expect(resolved).to.deep.equal(Object.assign(
        {},
        fixtures.goodPackage.config.json,
        {
          compilerOptions: Object.assign({}, fixtures.goodPackage.config.json.compilerOptions, {
            module: 'commonjs',
            target: 'es2017',
          }),
          extends: undefined,
        },
      ));
    });

    it('fails gracefully if there is a circular extension pattern', () => {
      const warn = stub(console, 'warn');

      const fixture = fixtures.circularExtensionPackage;
      const resolved = Config.resolve(fixture.index.directory);
      expect(warn).to.have.been.called;
      // tslint:disable-next-line max-line-length
      expect(resolved).to.deep.equal(Object.assign({}, fixture.config.json, { extends: undefined }));

      warn.restore();
    });
  });
});
