import { dirname } from 'path';
import { Transpiler, TsConfig } from './defs';
import { resolveConfig, resolveTranspiler } from './resolve';

export default class Cache {
  private static entries = new Map<string, Cache>();
  private dir: string;
  private myConfig: TsConfig;
  private myTranspiler: Transpiler | null;

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

  get config(): TsConfig {
    if (this.myConfig === undefined) {
      this.myConfig = resolveConfig(this.dir);
    }
    return this.myConfig;
  }

  get transpiler(): Transpiler | null {
    if (this.myTranspiler === undefined) {
      this.myTranspiler = resolveTranspiler(this.dir);
    }
    return this.myTranspiler;
  }
}
