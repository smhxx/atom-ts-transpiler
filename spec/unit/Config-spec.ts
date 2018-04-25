import '../helper';
import fixtures from '../fixtures';
import * as Config from '../../src/Config';

describe('Config.ts', () => {

  describe('resolveConfig()', () => {

    it('returns {} if the resolved config file is invalid', () => {
      const fixture = fixtures.badConfigPackage.config;
      const config = Config.load(fixture.path);
      expect(config).to.be.an('object');
      expect(config).to.deep.equal({});

      expect(atom.notifications.addError).to.have.been.calledOnce;
    });

    it('allows comments in the config', () => {
      const fixture = fixtures.commentedConfigPackage.config;
      const config = Config.load(fixture.path);
      expect(config).to.be.an('object');
      expect(config).to.deep.equal({
        compilerOptions: {
          module: 'commonjs',
          target: 'es2017',
        },
      });
    });

    it('supports config inheritance', () => {
      const fixture = fixtures.extendedConfigPackage.config;
      const config = Config.load(fixture.path);
      expect(config).to.be.an('object');
      expect(config).to.deep.equal(Object.assign(
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
      const fixture = fixtures.circularExtensionPackage.config;
      const config = Config.load(fixture.path);
      // tslint:disable-next-line max-line-length
      expect(config).to.deep.equal(Object.assign({}, fixture.json, { extends: undefined }));

      expect(atom.notifications.addWarning).to.have.been.calledOnce;
    });
  });
});
