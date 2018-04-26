import * as fs from 'fs';
import * as path from 'path';
import { PackageConfig, TranspileOptions, TranspilerModule } from './defs';

export class Transpiler {
  private static readonly instances = new Map<string, Transpiler>();
  public readonly dir: string;
  private myModule?: TranspilerModule | null;
  private myVersion?: string | null;

  private constructor(dir: string) {
    this.dir = dir;
    Transpiler.instances.set(dir, this);
  }

  public static get(tsDir: string): Transpiler {
    if (Transpiler.instances.has(tsDir)) {
      return Transpiler.instances.get(tsDir) as Transpiler;
    }
    return new Transpiler(tsDir);
  }

  // tslint:disable-next-line max-line-length
  public transpile(filePath: string, opts: TranspileOptions, verbose?: boolean): string | undefined {
    const ts = this.module;
    if (ts !== null) {
      try {
        const fileSrc = fs.readFileSync(filePath).toString();
        const output = ts.transpileModule(fileSrc, opts).outputText;

        if (verbose) {
          atom.notifications.addSuccess(`Successfully transpiled source file at ${opts.fileName}`);
        }

        return output;
      } catch (err) {
        atom.notifications.addFatalError(`Failed to read TypeScript source file from ${filePath}`);
      }
    }
    return undefined;
  }

  public get module(): TranspilerModule | null {
    if (this.myModule === undefined) {
      try {
        this.myModule = require(this.dir) as TranspilerModule;
      } catch (err) {
        // tslint:disable-next-line max-line-length
        atom.notifications.addFatalError(`Failed to load the typescript module from ${this.dir}.\nThis is unusual and probably means your package was not installed correctly. The error encountered was:\n${err.message}`);
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
        atom.notifications.addFatalError(`Failed to read the typescript package.json from ${this.dir}.\nThis is unusual and probably means your package was not installed correctly. The error encountered was:\n${err.message}`);
        this.myVersion = null;
      }
    }
    return this.myVersion;
  }
}
