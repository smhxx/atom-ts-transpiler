import * as fs from 'fs';
import * as path from 'path';
import { getCache } from './cache';
import { AtomTranspilerConfig as TsConfig, AtomPackageMeta, TranspiledModule } from './defs';

const concatFiles = (pkg: AtomPackageMeta) => (data: string, relPath: string) =>
  `${data}${fs.readFileSync(path.join(pkg.path, relPath))}`;

export function getCacheKeyData(_: any, __: any, opts: TsConfig, pkg: AtomPackageMeta) {
  return (opts.cacheKeyFiles instanceof Array) ?
    opts.cacheKeyFiles.reduce(concatFiles(pkg), '') : '';
}

export function transpile(_: any, fileName: string, opts = {}): TranspiledModule {
  const cache = getCache(fileName);
  const moduleName = path.basename(fileName).replace(/\.[^.]*$/, '');
  const compilerOptions = Object.assign({}, cache.config.compilerOptions, opts);
  const output: TranspiledModule = {};
  try {
    const ts = cache.transpiler;
    const fileSrc = fs.readFileSync(fileName, 'utf8');
    if (ts !== undefined) {
      const result = ts.transpileModule(fileSrc, { compilerOptions, fileName, moduleName });
      output.code = result.outputText;
    } else {
      output.code = fileSrc;
    }
  } catch (err) {
    // tslint:disable-next-line no-console max-line-length
    console.error(`Encountered an error while attempting to transpile module '${moduleName}' from path ${fileName}:\n\n${err.message}`);
  }
  return output;
}
