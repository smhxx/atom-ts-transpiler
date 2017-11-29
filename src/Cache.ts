import { dirname } from 'path';
import { Transpiler, TsConfig } from './defs';
import { resolveConfig, resolveTranspiler } from './resolve';

export default class Cache {
  private static entries = new Map<string, Cache>();
  private dir: string;
  private pConfig: TsConfig;
  private pTranspiler?: Transpiler;

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
    if (this.pConfig !== undefined) {
      return this.pConfig;
    } else {
      return resolveConfig(this.dir);
    }
  }

  get transpiler(): Transpiler | undefined {
    if (this.pTranspiler !== undefined) {
      return this.pTranspiler;
    } else {
      return resolveTranspiler(this.dir);
    }
  }
}
