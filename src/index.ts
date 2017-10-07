import * as fs from 'fs';
import * as path from 'path';
import { getCache } from './cache';
import { Options, PackageMeta, TranspiledModule, TranspileOptions, Transpiler } from './defs';

const concatFiles = (pkg: PackageMeta) => (data: string, relPath: string) =>
  `${data}${fs.readFileSync(path.join(pkg.path, relPath))}`;

function tryReadFile(fileName: string): string | undefined {
  try {
    return fs.readFileSync(fileName).toString();
  } catch (err) {
    // tslint:disable-next-line no-console max-line-length
    console.error(`Encountered an error while attempting to read module from path ${fileName}:\n\n${err.message}`);
  }
  return undefined;
}

function tryTranspile(ts: Transpiler, fileSrc: string, opts: TranspileOptions): string | undefined {
  try {
    return ts.transpileModule(fileSrc, opts).outputText;
  } catch (err) {
    // tslint:disable-next-line no-console max-line-length
    console.error(`Encountered an error while attempting to transpile module ${opts.moduleName} from path ${opts.fileName}:\n\n${err.message}`);
  }
  return undefined;
}

export function getCacheKeyData(_: any, __: any, opts: Options, pkg: PackageMeta) {
  return (opts.cacheKeyFiles instanceof Array) ?
    opts.cacheKeyFiles.reduce(concatFiles(pkg), '') : '';
}

export function transpile(_: any, fileName: string, opts: Options): TranspiledModule {
  const moduleName = path.basename(fileName).replace(/\.[^.]*$/, '');
  const fileSrc = tryReadFile(fileName);
  const output = {} as TranspiledModule;
  if (fileSrc !== undefined) {
    const cache = getCache(fileName);
    if (cache.transpiler !== undefined) {
      const compilerOptions = Object.assign({}, cache.options, opts.compilerOptions);
      const finalOpts = {
        fileName,
        moduleName,
        compilerOptions,
      } as TranspileOptions;
      output.code = tryTranspile(cache.transpiler, fileSrc, finalOpts);
    }
  }
  return output;
}
