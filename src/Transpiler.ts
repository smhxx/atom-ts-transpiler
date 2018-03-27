import * as path from 'path';
import { PackageConfig, TranspilerModule } from './defs';

export default class Transpiler {
  private static transpilers = new Map<string, Transpiler>();
  private dir: string;
  private myModule?: TranspilerModule | null;
  private myVersion?: string | null;

  private constructor(dir: string) {
    this.dir = dir;
    Transpiler.transpilers.set(dir, this);
  }

  public static get(tsDir: string): Transpiler {
    if (Transpiler.transpilers.has(tsDir)) {
      return Transpiler.transpilers.get(tsDir) as Transpiler;
    }
    return new Transpiler(tsDir);
  }

  public get module(): TranspilerModule | null {
    if (this.myModule === undefined) {
      try {
        this.myModule = require(this.dir) as TranspilerModule;
      } catch (err) {
        // tslint:disable-next-line max-line-length
        console.error(`Failed to load transpiler module for directory ${this.dir}.\nDo you have TypeScript installed as a peerDependency? Error message was:\n${err.message}`);
        this.myModule = null;
      }
    }
    return this.myModule;
  }

  public get version(): string | null {
    if (this.myVersion === undefined) {
      try {
        const packageJson = path.join(this.dir, 'package.json');
        const packageData = require(packageJson) as PackageConfig;
        this.myVersion = packageData.version;
      } catch (err) {
        // tslint:disable-next-line max-line-length
        console.error(`Failed to load transpiler package.json for directory ${this.dir}.\nDo you have TypeScript installed as a peerDependency? Error message was:\n${err.message}`);
        this.myVersion = null;
      }
    }
    return this.myVersion;
  }
}
