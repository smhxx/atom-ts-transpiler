/*
 *  Definitions for tsconfig.json
 */
export namespace TsConfig {
  interface CompilerOptions {
    readonly allowJs?: boolean;
    readonly allowSyntheticDefaultImports?: boolean;
    readonly allowUnreachableCode?: boolean;
    readonly allowUnusedLabels?: boolean;
    readonly alwaysStrict?: boolean;
    readonly baseUrl?: string;
    readonly charset?: string;
    readonly checkJs?: boolean;
    readonly declaration?: boolean;
    readonly declarationDir?: string;
    readonly diagnostics?: boolean;
    readonly downlevelIteration?: boolean;
    readonly emitBOM?: boolean;
    readonly emitDecoratorMetadata?: boolean;
    readonly experimentalDecorators?: boolean;
    readonly forceConsistentCasingInFileNames?: boolean;
    readonly importHelpers?: boolean;
    readonly inlineSourceMap?: boolean;
    readonly inlineSources?: boolean;
    readonly isolatedModules?: boolean;
    readonly jsx?: string;
    readonly jsxFactory?: string;
    readonly lib?: ReadonlyArray<string>;
    readonly listEmittedFiles?: boolean;
    readonly listFiles?: boolean;
    readonly locale?: string;
    readonly mapRoot?: string;
    readonly maxNodeModuleJsDepth?: number;
    readonly module?: string;
    readonly moduleResolution?: string;
    readonly newLine?: string;
    readonly noEmit?: boolean;
    readonly noEmitHelpers?: boolean;
    readonly noEmitOnError?: boolean;
    readonly noFallthroughCasesInSwitch?: boolean;
    readonly noImplicitAny?: boolean;
    readonly noImplicitReturns?: boolean;
    readonly noImplicitThis?: boolean;
    readonly noImplicitUseStrict?: boolean;
    readonly noLib?: boolean;
    readonly noResolve?: boolean;
    readonly noStrictGenericChecks?: boolean;
    readonly noUnusedLocals?: boolean;
    readonly noUnusedParameters?: boolean;
    readonly outDir?: string;
    readonly outFile?: string;
    readonly paths?: { readonly [moduleName: string]: ReadonlyArray<string> };
    readonly plugins?: ReadonlyArray<{ name: string }>;
    readonly preserveConstEnums?: boolean;
    readonly preserveSymlinks?: boolean;
    readonly pretty?: boolean;
    readonly reactNamespace?: string;
    readonly removeComments?: boolean;
    readonly rootDir?: string;
    readonly rootDirs?: ReadonlyArray<string>;
    readonly skipDefaultLibCheck?: boolean;
    readonly sourceMap?: boolean;
    readonly sourceRoot?: string;
    readonly strict?: boolean;
    readonly strictNullChecks?: boolean;
    readonly stripInternal?: boolean;
    readonly suppressExcessPropertyErrors?: boolean;
    readonly suppressImplicitAnyIndexErrors?: boolean;
    readonly target?: string;
    readonly traceResolution?: boolean;
    readonly typeRoots?: ReadonlyArray<string>;
    readonly types?: ReadonlyArray<string>;
    readonly watch?: boolean;
  }

  interface TypeAcquisition {
    readonly enable?: boolean;
    readonly include?: ReadonlyArray<string>;
    readonly exclude?: ReadonlyArray<string>;
  }
}

export interface TsConfig {
  readonly extends?: string;
  readonly compileOnSave?: boolean;
  readonly compilerOptions?: TsConfig.CompilerOptions;
  readonly typeAcquisition?: TsConfig.TypeAcquisition;
  readonly files?: ReadonlyArray<string>;
  readonly exclude?: ReadonlyArray<string>;
  readonly include?: ReadonlyArray<string>;
}

/*
 *  Definitions for package.json
 */
export namespace PackageConfig {
  type ModulesRecord = { readonly [moduleName: string]: string };

  interface Person {
    readonly name: string;
    readonly url?: string;
    readonly email?: string;
  }

  interface TypeAndUrl {
    readonly type?: string;
    readonly url?: string;
  }

  interface BugsInfo {
    readonly url?: string;
    readonly email?: string;
  }

  interface Directories {
    readonly bin?: string;
    readonly doc?: string;
    readonly example?: string;
    readonly lib?: string;
    readonly man?: string;
    readonly test?: string;
  }

  interface CoreProperties {
    readonly name: string;
    readonly version: string;
    readonly description?: string;
    readonly keywords?: ReadonlyArray<string>;
    readonly homepage?: string;
    readonly bugs?: BugsInfo | string;
    readonly license?: string;
    readonly licenses?: ReadonlyArray<TypeAndUrl>;
    readonly author?: Person;
    readonly contributors?: ReadonlyArray<Person>;
    readonly maintainers?: ReadonlyArray<Person>;
    readonly files?: ReadonlyArray<string>;
    readonly main?: string;
    readonly bin?: ModulesRecord | string;
    readonly man?: ReadonlyArray<string> | string;
    readonly directories?: Directories;
    readonly repository?: TypeAndUrl | string;
    readonly scripts?: Readonly<Record<string, string>>;
    readonly config?: Readonly<Record<string, any>>;
    readonly dependencies?: ModulesRecord;
    readonly devDependencies?: ModulesRecord;
    readonly optionalDependencies?: ModulesRecord;
    readonly peerDependencies?: ModulesRecord;
    readonly engines?: Readonly<Record<string, string>>;
    readonly engineStrict?: boolean;
    readonly os?: ReadonlyArray<string>;
    readonly cpu?: ReadonlyArray<string>;
    readonly preferGlobal?: boolean;
    readonly private?: boolean;
    readonly publishConfig?: Readonly<Record<string, any>>;
    readonly dist?: { readonly shasum: string, readonly tarball: string };
    readonly readme?: string;
  }
}

export interface PackageConfig extends PackageConfig.CoreProperties {
  readonly jpsm?: PackageConfig.CoreProperties;
}

/*
 *  Definitions for Atom-specific package.json
 */
export namespace AtomPackageConfig {
  interface TranspilerListing {
    readonly glob: string;
    readonly transpiler: string;
    readonly options?: object;
  }
}

export interface AtomPackageConfig extends PackageConfig {
  readonly atomTranspilers?: ReadonlyArray<AtomPackageConfig.TranspilerListing>;
}

/*
 *  Definitions for the TypeScript transpiler mock
 */
export interface TranspileOptions {
  compilerOptions?: TsConfig.CompilerOptions;
  fileName?: string;
  reportDiagnostics?: boolean;
  moduleName?: string;
}

export interface TranspileOutput {
  outputText: string;
  diagnostics?: any[];
  sourceMapText?: string;
}

export interface TranspilerModule {
  transpileModule(input: string, options: TranspileOptions): TranspileOutput;
}

/*
 *  Definitions related to the Atom transpiler system
 */
export interface PackageMeta {
  name: string;
  path: string;
  meta: AtomPackageConfig;
}

export interface TranspiledModule {
  code?: string;
}

/*
 *  Definitions used directly by atom-ts-transpiler
 */
export interface Options {
  readonly cacheKeyFiles?: ReadonlyArray<string>;
  readonly compilerOptions?: TsConfig.CompilerOptions;
  readonly verbose?: boolean;
}
