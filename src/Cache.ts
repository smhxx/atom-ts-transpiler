import * as fs from 'fs';
import * as path from 'path';
import * as Config from './Config';
import { Transpiler } from './Transpiler';
import { TsConfig } from './defs';

function* searchLocations(baseDir: string, resourceName: string): IterableIterator<string> {
  let next = baseDir;
  let prev = '';
  while (prev !== next && path.basename(next) !== 'node_modules') {
    yield path.join(next, resourceName);
    prev = next;
    next = path.join(next, '../');
  }
}

function findResource(baseDir: string, resourceName: string): string | null {
  for (const location of searchLocations(baseDir, resourceName)) {
    if (fs.existsSync(location)) {
      return location;
    }
  }
  return null;
}

export class Cache {
  private static readonly entries = new Map<string, Cache>();
  public readonly dir: string;
  private myConfig?: TsConfig;
  private myTranspiler?: Transpiler | null;

  private constructor(dir: string) {
    this.dir = dir;
    Cache.entries.set(dir, this);
  }

  public static get(filePath: string): Cache {
    const dir = path.dirname(filePath);
    if (Cache.entries.has(dir)) {
      return Cache.entries.get(dir) as Cache;
    }
    return new Cache(dir);
  }

  public get config(): TsConfig {
    if (this.myConfig === undefined) {
      const configFile = findResource(this.dir, 'tsconfig.json');
      if (configFile !== null) {
        this.myConfig = Config.load(configFile);
      } else {
        this.myConfig = {};
      }
    }
    return this.myConfig;
  }

  public get transpiler(): Transpiler | null {
    if (this.myTranspiler === undefined) {
      const typescriptDir = findResource(this.dir, 'node_modules/typescript');
      if (typescriptDir !== null) {
        this.myTranspiler = Transpiler.get(typescriptDir);
      } else {
        // tslint:disable-next-line max-line-length
        atom.notifications.addError(`Could not resolve the TypeScript module associated with ${this.dir}\nIs it listed as a dependency of your package?`);
        this.myTranspiler = null;
      }
    }
    return this.myTranspiler;
  }
}
