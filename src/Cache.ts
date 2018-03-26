import { dirname, resolve } from 'path';
import Config from './Config';
import { PackageConfig, TranspilerModule, TsConfig } from './defs';

export default class Cache {
  private static entries = new Map<string, Cache>();
  private dir: string;
  private myConfig?: TsConfig;
  private myTranspilerModule?: TranspilerModule | null;
  private myTranspilerVersion?: string | null;

  private constructor(dir: string) {
    this.dir = dir;
    Cache.entries.set(dir, this);
  }

  public static get(path: string): Cache {
    const dir = dirname(path);
    if (Cache.entries.has(dir)) {
      return Cache.entries.get(dir) as Cache;
    }
    return new Cache(dir);
  }

  public get config(): TsConfig {
    if (this.myConfig === undefined) {
      this.myConfig = Config.resolve(this.dir);
    }
    return this.myConfig;
  }

  public get transpilerModule(): TranspilerModule | null {
    if (this.myTranspilerModule === undefined) {
      try {
        const location = resolve(this.dir, 'node_modules', 'typescript');
        this.myTranspilerModule = require(location) as TranspilerModule;
      } catch (err) {
        // tslint:disable-next-line max-line-length
        console.error(`Failed to load transpiler module for directory ${this.dir}.\nDo you have TypeScript installed as a peerDependency? Error message was:\n${err.message}`);
        this.myTranspilerModule = null;
      }
    }
    return this.myTranspilerModule;
  }

  public get transpilerVersion(): string | null {
    if (this.myTranspilerVersion === undefined) {
      try {
        const location = resolve(this.dir, 'node_modules', 'typescript', 'package.json');
        const data = require(location) as PackageConfig;
        this.myTranspilerVersion = data.version;
      } catch (err) {
        // tslint:disable-next-line max-line-length
        console.error(`Failed to load transpiler package.json for directory ${this.dir}.\nDo you have TypeScript installed as a peerDependency? Error message was:\n${err.message}`);
        this.myTranspilerVersion = null;
      }
    }
    return this.myTranspilerVersion;
  }
}
