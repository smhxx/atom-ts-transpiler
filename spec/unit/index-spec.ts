import '../helper';
import fixtures from '../fixtures';
import * as path from 'path';
import { getCacheKeyData, transpile } from '../../src/index';
import { Options, PackageMeta, TsConfig } from '../../src/defs';

describe('atom-ts-transpiler', () => {

  describe('.getCacheKeyData()', () => {

    const meta:PackageMeta = {
      name: 'good-package',
      path: fixtures.goodPackage.package.directory,
      meta: fixtures.goodPackage.package.json,
    };

    // tslint:disable-next-line max-line-length
    it('returns the resolved tsconfig options and TS version number, concatenated with the contents of any listed cacheKeyFiles', () => {
      const fixture = fixtures.goodPackage;
      const cacheKeyFiles = [
        'index.ts',
        'other.ts',
      ];
      const config = Object.assign({}, fixture.config.json, { cacheKeyFiles });
      const data = getCacheKeyData('', fixture.index.path, config, meta);

      expect(data).not.to.equal('');
      expect(data).to.contain(JSON.stringify(fixture.config.json));
      expect(data).to.contain(fixture.typescriptPackageJson.json.version);
      expect(data).to.contain(fixture.index.contents);
      expect(data).to.contain(fixture.other.contents);
    });

    it('omits the TS version number if the typescript package could not be resolved', () => {
      const error = stub(console, 'error');

      const fixture = fixtures.noTranspilerPackage;
      const cacheKeyFiles = [
        'index.ts',
      ];
      const config = Object.assign({}, fixture.config.json, { cacheKeyFiles });
      const data = getCacheKeyData('', fixture.index.path, config, meta);

      expect(data).not.to.equal('');
      expect(data).to.contain(JSON.stringify(fixture.config.json));
      expect(data).to.contain(fixture.index.contents);

      error.restore();
    });

    // tslint:disable-next-line max-line-length
    it('returns only the resolved tsconfig options and TS version number if no cacheKeyFiles are specified', () => {
      const fixture = fixtures.goodPackage;
      const data: string = getCacheKeyData('', fixture.index.path, fixture.config.json, meta);
      expect(data).to.equal(
        JSON.stringify(fixture.config.json) + fixture.typescriptPackageJson.json.version,
      );
    });
  });

  describe('.transpile()', () => {

    let transpileModule: Stub;

    beforeEach(() => {
      transpileModule = stub(fixtures.goodPackage.typescript.module, 'transpileModule').returns({
        diagnostics: [],
        outputText: 'output',
      });
    });

    afterEach(() => {
      transpileModule.restore();
    });

    it('calls the appropriate transpiler with the contents of the source file', () => {
      transpile('', fixtures.goodPackage.index.path, {});
      expect(transpileModule).to.have.been.calledOnce;
      expect(transpileModule).to.have.been.calledWith(fixtures.goodPackage.index.contents);
    });

    it('writes any encountered errors to console.error() and does not return any code', () => {
      const error = stub(console, 'error');
      transpileModule.throws(new Error('the message attached to the thrown error'));

      const output = transpile('', fixtures.goodPackage.index.path, {});
      expect(error.getCall(0).args[0]).to.contain('the message attached to the thrown error');
      expect(output).to.be.an('object');
      expect(output.code).to.be.undefined;

      error.restore();
    });

    it('uses the compiler options specified in tsconfig.json', () => {
      transpile('', fixtures.goodPackage.index.path, {});
      expect(transpileModule).to.have.been.calledOnce;
      expect(transpileModule.getCall(0).args[1].compilerOptions.removeComments).to.be.true;
    });

    it('overrides the tsconfig options with any specified in the package.json', () => {
      const compilerOptions: TsConfig.CompilerOptions = { removeComments: false };
      const options: Options = { compilerOptions };
      transpile('', fixtures.goodPackage.index.path, options);
      expect(transpileModule).to.have.been.calledOnce;
      expect(transpileModule.getCall(0).args[1].compilerOptions.removeComments).to.be.false;
    });

    it('writes an error to console and returns no code if the file does not exist', () => {
      const error = stub(console, 'error');

      const filePath = path.resolve(fixtures.goodPackage.index.directory, 'not-a-real-file.ts');
      const output = transpile('', filePath, {});
      expect(error.getCall(0).args[0]).to.match(/ENOENT/);
      expect(output).to.deep.equal({ code: undefined });

      error.restore();
    });

    it('returns no code if the typescript package could not be resolved', () => {
      const error = stub(console, 'error');

      const output = transpile('', fixtures.noTranspilerPackage.index.path, {});
      expect(output).to.deep.equal({ code: undefined });

      error.restore();
    });

    it('returns no code if the typescript package was resolved but could not be loaded', () => {
      const error = stub(console, 'error');

      const output = transpile('', fixtures.badTranspilerPackage.index.path, {});
      expect(output).to.deep.equal({ code: undefined });

      error.restore();
    });

    it('writes debugging text to console if the verbose option is set to true', () => {
      const log = stub(console, 'log');

      transpile('', fixtures.goodPackage.index.path, { verbose: true });
      expect(log).to.have.been.calledTwice;

      log.restore();
    });

    it('does not write to the console if the verbose option is not set', () => {
      const log = stub(console, 'log');

      transpile('', fixtures.goodPackage.index.path, {});
      expect(log).not.to.have.been.called;

      log.restore();
    });
  });
});
