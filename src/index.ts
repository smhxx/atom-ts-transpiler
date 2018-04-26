import * as fs from 'fs';
import * as path from 'path';
import { Cache } from './Cache';
import { Options, PackageMeta, TranspiledModule } from './defs';

const concatFiles = (basePath: string) => (data: string, relPath: string) =>
  `${data}${fs.readFileSync(path.join(basePath, relPath))}`;

export function getCacheKeyData(_: any, fileName: string, opts: Options, pkg: PackageMeta): string {
  const cache = Cache.get(fileName);
  let data = JSON.stringify(cache.config);
  if (cache.transpiler !== null) {
    data += cache.transpiler.version;
  }
  if (opts.cacheKeyFiles instanceof Array) {
    data += opts.cacheKeyFiles.reduce(concatFiles(pkg.path), '');
  }
  return data;
}

export function transpile(_: any, fileName: string, opts: Options): TranspiledModule {
  const cache = Cache.get(fileName);
  const transpiler = cache.transpiler;

  let code: string | undefined;
  if (transpiler !== null) {
    const fileExtension = /\.[^.]*$/;
    const moduleName = path.basename(fileName).replace(fileExtension, '');
    const compilerOptions = Object.assign({}, cache.config.compilerOptions, opts.compilerOptions);
    const finalOpts = {
      fileName,
      moduleName,
      compilerOptions,
    };

    code = transpiler.transpile(fileName, finalOpts, opts.verbose);
  }

  return { code };
}
