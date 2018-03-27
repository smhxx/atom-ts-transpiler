import * as path from 'path';
import Config from './Config';
import resolve from './resolve';
import Transpiler from './Transpiler';
import { TranspilerModule, TsConfig } from './defs';

export default class Cache {
  private static entries = new Map<string, Cache>();
  private dir: string;
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
      this.myConfig = Config.resolve(this.dir);
    }
    return this.myConfig;
  }

  public get transpilerModule(): TranspilerModule | null {
    const transpiler = this.transpiler;
    return transpiler ? transpiler.module : null;
  }

  public get transpilerVersion(): string | null {
    const transpiler = this.transpiler;
    return transpiler ? transpiler.version : null;
  }

  private get transpiler(): Transpiler | null {
    if (this.myTranspiler === undefined) {
      const modulesDir = resolve(this.dir, 'node_modules');
      if (modulesDir !== undefined) {
        const typescriptDir = path.join(modulesDir, 'typescript');
        this.myTranspiler = Transpiler.get(typescriptDir);
      } else {
        // tslint:disable-next-line max-line-length
        console.error(`Could not resolve node_modules directory associated with ${this.dir}\nIs this package properly installed?`);
        this.myTranspiler = null;
      }
    }
    return this.myTranspiler;
  }
}
