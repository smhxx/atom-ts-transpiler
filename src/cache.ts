import { dirname } from 'path';
import { Transpiler, TsConfig } from './defs';
import { resolveConfig, resolveTranspiler } from './resolve';

export default class Cache {
  private static entries = new Map<string, Cache>();
  private dir: string;
  private _options: TsConfig.CompilerOptions;
  private _transpiler?: Transpiler;

  private constructor(dir: string) {
    this.dir = dir;
    Cache.entries.set(dir, this);
  }

  public static get(path: string): Cache {
    const dir = dirname(path);
    if (Cache.entries.has(dir)) {
      return Cache.entries.get(dir) as Cache;
    } else {
      return new Cache(dir);
    }
  }

  get options(): TsConfig.CompilerOptions {
    if (this._options !== undefined) {
      return this._options;
    } else {
      return resolveConfig(this.dir);
    }
  }

  get transpiler(): Transpiler | undefined {
    if (this._transpiler !== undefined) {
      return this._transpiler;
    } else {
      return resolveTranspiler(this.dir);
    }
  }
}
