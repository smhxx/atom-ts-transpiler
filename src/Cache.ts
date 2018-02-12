import { dirname } from 'path';
import Config from './Config';
import Transpiler from './Transpiler';
import { Transpiler as TsTranspiler, TsConfig } from './defs';

export default class Cache {
  private static entries = new Map<string, Cache>();
  private dir: string;
  private myConfig?: TsConfig;
  private myTranspiler?: TsTranspiler | null;

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

  public get transpiler(): TsTranspiler | null {
    if (this.myTranspiler === undefined) {
      this.myTranspiler = Transpiler.resolve(this.dir);
    }
    return this.myTranspiler;
  }
}
