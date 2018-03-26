import * as fs from 'fs';
import * as path from 'path';
import Cache from './Cache';
import { Options, PackageMeta, TranspiledModule, TranspileOptions, TranspilerModule } from './defs';

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

function tryTranspile(
  ts: TranspilerModule,
  fileSrc: string,
  opts: TranspileOptions,
): string | undefined {
  try {
    return ts.transpileModule(fileSrc, opts).outputText;
  } catch (err) {
    // tslint:disable-next-line max-line-length
    console.error(`Encountered an error while attempting to transpile module ${opts.moduleName} from path ${opts.fileName}:\n\n${err.message}`);
  }
  return undefined;
}

export function getCacheKeyData(_: any, fileName: string, opts: Options, pkg: PackageMeta): string {
  const cache = Cache.get(fileName);
  let data = JSON.stringify(cache.config) + cache.transpilerVersion;
  if (opts.cacheKeyFiles instanceof Array) {
    data += opts.cacheKeyFiles.reduce(concatFiles(pkg), '');
  }
  return data;
}

export function transpile(_: any, fileName: string, opts: Options): TranspiledModule {
  const moduleName = path.basename(fileName).replace(/\.[^.]*$/, '');
  const verbose = (opts.verbose === true);

  if (verbose) {
    console.log(`Received call to transpile module ${moduleName} from path ${fileName}.`);
  }

  const fileSrc = tryReadFile(fileName);
  const output = {} as TranspiledModule;
  if (fileSrc !== undefined) {
    const cache = Cache.get(fileName);
    if (cache.transpilerModule !== null) {
      const compilerOptions = Object.assign({}, cache.config.compilerOptions, opts.compilerOptions);
      const finalOpts = {
        fileName,
        moduleName,
        compilerOptions,
      } as TranspileOptions;

      if (verbose) {
        // tslint:disable-next-line max-line-length
        console.log(`Transpiling module '${moduleName}' using options:\n${JSON.stringify(finalOpts, null, 2)}`);
      }

      output.code = tryTranspile(cache.transpilerModule, fileSrc, finalOpts);
    }
  }
  return output;
}
