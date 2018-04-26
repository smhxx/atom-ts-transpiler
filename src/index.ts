import * as fs from 'fs';
import * as path from 'path';
import { Cache } from './Cache';
import { Options, PackageMeta, TranspiledModule } from './defs';

const concatFiles = (pkg: PackageMeta) => (data: string, relPath: string) =>
  `${data}${fs.readFileSync(path.join(pkg.path, relPath))}`;

export function getCacheKeyData(_: any, fileName: string, opts: Options, pkg: PackageMeta): string {
  const cache = Cache.get(fileName);
  let data = JSON.stringify(cache.config);
  if (cache.transpiler !== null) {
    data += cache.transpiler.version;
  }
  if (opts.cacheKeyFiles instanceof Array) {
    data += opts.cacheKeyFiles.reduce(concatFiles(pkg), '');
  }
  return data;
}

export function transpile(_: any, fileName: string, opts: Options): TranspiledModule {
  const fileExtension = /\.[^.]*$/;
  const moduleName = path.basename(fileName).replace(fileExtension, '');

  let code: string | undefined;
  const cache = Cache.get(fileName);
  const transpiler = cache.transpiler;
  if (transpiler !== null) {
    try {
      const fileSrc = fs.readFileSync(fileName).toString();
      const compilerOptions = Object.assign({}, cache.config.compilerOptions, opts.compilerOptions);
      const finalOpts = {
        fileName,
        moduleName,
        compilerOptions,
      };

      code = transpiler.transpile(fileSrc, finalOpts, opts.verbose);
    } catch (err) {
      // tslint:disable-next-line max-line-length
      atom.notifications.addFatalError(`Failed to read TypeScript source file at ${fileName}. (ENOENT)`);
    }
  }

  return { code };
}
