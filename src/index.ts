import * as fs from 'fs';
import * as path from 'path';
import { Cache } from './Cache';
import { Options, PackageMeta, TranspiledModule, TranspileOptions } from './defs';

const concatFiles = (pkg: PackageMeta) => (data: string, relPath: string) =>
  `${data}${fs.readFileSync(path.join(pkg.path, relPath))}`;

function tryReadFile(fileName: string): string | undefined {
  try {
    return fs.readFileSync(fileName).toString();
  } catch (err) {
    // tslint:disable-next-line max-line-length
    console.error(`Encountered an error while attempting to read module from path ${fileName}:\n\n${err.message}`);
  }
  return undefined;
}

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
  const verbose = (opts.verbose === true);

  if (verbose) {
    console.log(`Received call to transpile module ${moduleName} from path ${fileName}.`);
  }

  const fileSrc = tryReadFile(fileName);
  let code: string | undefined;
  if (fileSrc !== undefined) {
    const cache = Cache.get(fileName);
    const transpiler = cache.transpiler;
    if (transpiler !== null) {
      const compilerOptions = Object.assign({}, cache.config.compilerOptions, opts.compilerOptions);
      const finalOpts = {
        fileName,
        moduleName,
        compilerOptions,
      } as TranspileOptions;

      code = transpiler.transpile(fileSrc, finalOpts, verbose);
    }
  }
  return { code };
}
