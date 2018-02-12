[![Travis](https://img.shields.io/travis/smhxx/atom-ts-transpiler/master.svg)](https://travis-ci.org/smhxx/atom-ts-transpiler)
[![Version](https://img.shields.io/npm/v/atom-ts-transpiler.svg)](https://www.npmjs.com/package/atom-ts-transpiler)
[![Downloads](https://img.shields.io/npm/dt/atom-ts-transpiler.svg)](https://www.npmjs.com/package/atom-ts-transpiler)
[![CodeCov](https://codecov.io/gh/smhxx/atom-ts-transpiler/branch/master/graph/badge.svg)](https://codecov.io/gh/smhxx/atom-ts-transpiler)
[![Dependencies](https://david-dm.org/smhxx/atom-ts-transpiler/status.svg)](https://david-dm.org/smhxx/atom-ts-transpiler)
[![DevDependencies](https://david-dm.org/smhxx/atom-ts-transpiler/dev-status.svg)](https://david-dm.org/smhxx/atom-ts-transpiler?type=dev)
# atom-ts-transpiler

This package provides a simple, easily-configured compatibility layer that sits between [Atom](https://atom.io/) and the [TypeScript](https://www.typescriptlang.org/) compiler, giving Atom the ability to run packages written and distributed entirely in TypeScript. It's small (\<25 KB including documentation,) supports any version of TypeScript since 1.6, and can be set up within minutes. It even respects the compiler options specified in your tsconfig.json file automatically, without the need for any additional configuration.

This project was inspired by the GitHub team's [atom-babel6-transpiler](https://www.npmjs.com/package/atom-babel6-transpiler), and utilizes the same interface to provide Atom with the ability to transpile TypeScript code on-demand. Special thanks go to them, as well as the other Atom users and community members who helped see this project through to a stable release.

## About
<img alt="" src="https://upload.wikimedia.org/wikipedia/commons/8/80/Atom_editor_logo.svg" align="right" />
<details>
<summary><b>Why use TypeScript with Atom?</b></summary>

Because TypeScript is great! It has all of the benefits of JavaScript, with the addition of a flexible and robust type system far beyond the basic 7-8 types that exist in vanilla JS. Aside from the obvious safety benefits of strong typing, it also empowers your editor/IDE with an understanding of the types that are used in your code, meaning awesome workflow emprovements like better linting, instant type-checking, and even type-sensitive autocomplete! If you haven't tried TypeScript yet, give it a shot... it really is worth it!
</details>
<details>
<summary><b>What's a "custom package transpiler?"</b></summary>

Essentially, a custom package transpiler serves as a shim between Atom and your package, showing Atom how to deal with files that it doesn't natively understand what to do with. In this case, it takes responsibility for your package's TypeScript files, and converts them to JavaScript on-demand as Atom requires them. Atom then caches the transpiled code for each file, only asking for re-transpilation if the cache becomes invalid (such as when the package is updated.) If Atom already has your entire package cached, the TypeScript compiler is never even loaded, and performance-wise, it functions just as if you had written the entire package in JavaScript to begin with!

</details>
<details>
<summary><b>Doesn't Atom already support TypeScript?</b></summary>

Sort of? Yes and no. Atom does have a very basic, naïve understanding of TypeScript, but unfortunately it's not sufficient for the vast majority of packages. By default, if Atom encounters a .ts file at runtime, it attempts to transpile it using TypeScript 1.4; however, there's no way to specify that a newer version of TypeScript should be used, or to set compiler options manually, making it impossible to use many modern TypeScript 2.x features. The goal of this project is to enable projects to use *any* recent version of TypeScript that they require, and to configure the compiler as needed, in a simple and completely painless way. Just add the dependency, enable it in your package.json, and you're good to go.
</details>
<details>
<summary><b>What sort of performance do transpiled packages get?</b></summary>

The first time a user activates your package after installing it, there may be a brief delay (sometimes about a second) as Atom converts the downloaded TypeScript source files to JavaScript. On subsequent activations, however, Atom will use the cached build output generated on the previous activation, meaning that the long-term increase in activation time is near-zero (well under 10ms even for reasonably large packages.) This small difference is mainly due to Atom confirming that the cached version of each file it requires is still valid; other than that, there is no long-term performance penalty at all vs. native JavaScript packages.
</details>
<details>
<summary><b>Can't I just transpile my package myself?</b></summary>

Yes, absolutely. In fact, *this* package is written in TypeScript and transpiled prior to publishing. However, it's a bit more complicated for Atom packages, since your package is hosted directly from its GitHub repo, rather than published to an external package repository like npm. Users download your package exactly as it exists on your master branch, so if you want your code to be transpiled *prior to* distribution, you'll have to actually commit the transpiled output to the repo (e.g. by setting up a pre-commit hook to run `tsc`,) and the user will end up downloading both the TypeScript and JavaScript versions, anyway. With a custom transpiler, all that mess can be avoided. The transpilation of your TypeScript code is handled automatically by Atom itself, with zero performance penalty after the first time the package is installed and run.
</details>
<details>
<summary><b>How can I contribute to the project?</b></summary>

Right now, the best way to help out with `atom-ts-transpiler` is simply to *use it* and provide feedback if you feel there are any improvements that can be made. Long-term stability is one of our foremost goals, and we feel like we've achieved it; the project has 100% unit test coverage, and integration tests that are run against each new release of Atom, so there's no need to worry about your package suddenly breaking because of an update. Take it for a spin and let us know what you think! 🙂

If you'd like to contribute in a more direct way, see our [Contribution Guide](https://github.com/smhxx/atom-ts-transpiler/blob/master/.github/CONTRIBUTING.md) and [Code of Conduct](https://github.com/smhxx/atom-ts-transpiler/blob/master/.github/CODE_OF_CONDUCT.md) on GitHub. We always welcome [issues](https://github.com/smhxx/atom-ts-transpiler/issues) and [pull requests](https://github.com/smhxx/atom-ts-transpiler/pulls) from the community, if you find a bug or if you think there are improvements to be made.
</details>

## Setup &amp; Configuration

Setting up your project to use `atom-ts-transpiler` is *extremely* simple. Just write your package in TypeScript, then follow these steps to get it running in Atom:

1. Add `atom-ts-transpiler` and `typescript` to your package.json as dependencies (***not*** *devDependencies*) or do `npm install --save atom-ts-transpiler typescript` from the command line. Any version of TypeScript since 1.6 should be compatible, so feel free to specify whatever version range is appropriate for your package. Note that `atom-ts-transpiler` relies on features introduced in TypeScript 1.6, so older versions will definitely **not** work.
2. Make sure that your package has a [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file, and that it builds properly with `tsc --project` on the command-line. Alternatively, you can specify compiler options in your package.json instead (see below,) but having a tsconfig is highly recommended. If you have more than one tsconfig file, each source file will use the closest one, starting with the directory it's in and considering only direct ancestors.
3. Finally, tell Atom about the transpiler by adding an `atomTranspilers` property to your package.json file, like so:
```js
{
  "name": "my-super-duper-package",
  "version": "2.1.4",
  // ...
  "atomTranspilers": [
    {
      "transpiler": "atom-ts-transpiler",
      "glob": "{!(node_modules)/**/,}*.ts?(x)",
      "options": {
        "compilerOptions": { },
        "cacheKeyFiles": [],
        "verbose": false
      }
    }
  ]
}
```
| Property | Type | Description |
|----------|:----:|-------------|
| `transpiler` | `string` | The name of the package which will handle transpilation of files matching `glob`.
| `glob` | `string` | A minimatch-style [glob](https://github.com/isaacs/node-glob) specifying which files this transpiler should be responsible for transpiling. The glob shown above, `{!(node_modules)/**/,}*.ts?(x)`, should be appropriate for 99% of packages, but can be tweaked as necessary.
| `options` | `object` or `undefined` | An object containing configuration options to be passed to the transpiler package. The options listed below are the ones available for `atom-ts-transpiler`. |
| »&emsp;`.compilerOptions` | `object` or `undefined` | A record of TypeScript compiler options, identical to the `compilerOptions` property available within tsconfig files. Options specified here will apply to all files, overriding those specified in the project's tsconfig.json file.
| »&emsp;`.cacheKeyFiles` | `string[]` or `undefined` | A list of file paths relative to the package's root directory which are considered critical to the compile cache's validity. If any of the files listed here are changed or updated, *all* of the cached files generated with this transpiler will be considered stale and re-transpiled the next time they are required. This typically means files that affect the build output but aren't required at runtime. (Note that each file's associated tsconfig.json is automatically included in this list and doesn't need to be manually specified.)
| »&emsp;`.verbose` | `boolean` or `undefined` | When set to `true`, will output debugging text to the Developer Console (Ctrl+Shift+I) each time a file is transpiled. This can be useful for debugging your project, but it's not recommended that you distribute a package with this option enabled.

And that's it! Now, any time a file matching `glob` is loaded or required at runtime, Atom will first pass it through the TypeScript transpiler, caching the result until your package is updated or one of the `cacheKeyFiles` changes. It's that easy!

### Peer Dependencies

#### Required Peer Dependencies

* [typescript](https://www.npmjs.com/package/typescript): *Any version 1.6 or later should be compatible, but versions older than 1.6 definitely **will not** work. Use whichever version you need in order for your package to compile properly (although, of course, more recent versions are usually preferable.)*

#### Recommended Peer Dependencies

* [@types/atom](https://www.npmjs.com/package/@types/atom): *TypeScript definitions for the [Atom API](https://atom.io/docs/api/v1.21.0/AtomEnvironment), maintained as part of the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) project. You'll almost certainly need this unless you're getting your typedefs from somewhere else.*

#### Optional "Peer Dev Dependencies"

None of these are strictly necessary, but you may find some or all of them useful in developing your package. If you know of any other packages you think you should be listed here, let us know!

* [atom-transpiler-debug-tool](https://www.npmjs.com/package/atom-transpiler-debug-tool): *A convenient script for inspecting the state of the Atom compile cache, which can help isolate issues in projects that use custom transpilers.*
* [atom-mocha-test-runner](https://www.npmjs.com/package/atom-mocha-test-runner): *An alternate test runner for Atom packages, which (with some tinkering) can be configured to run tests written in TypeScript.*
* [@types/atom-mocha-test-runner](https://www.npmjs.com/package/@types/atom-mocha-test-runner): *Additional type definitions for* `atom-mocha-test-runner`.

## Example Projects

The [examples directory](https://github.com/smhxx/atom-ts-transpiler/tree/master/examples) of the GitHub repo contains a bare-bones example of what a new package setup might look like, if you're looking for somewhere to get started. If you want to see how people are using `atom-ts-transpiler` in their own packages, check out one of these!

* [ide-powershell](https://atom.io/packages/ide-powershell): *A package for Atom providing rich PowerShell language features via Atom IDE!*
* [path-of-exile-item-filter](https://atom.io/packages/path-of-exile-item-filter): *An Atom package designed to make editing Path of Exile item filters easier.*

If you'd like to see your package listed here to help out newcomers to the Atom/TypeScript modding community, we'd love to hear from you! Just [open an issue](https://github.com/smhxx/atom-ts-transpiler/issues) on GitHub with a link to its [Atom package directory](https://atom.io/packages) page and a brief description of what it does, and we'll add you here in the next patch version. 😊

## License

The source code of this project is released under the [MIT Expat License](https://opensource.org/licenses/MIT), which freely permits reuse and redistribution. Feel free to use and/or modify it in any way, provided that you include the copyright notice and terms of this license with any copies that you make.

><img src="https://upload.wikimedia.org/wikipedia/commons/3/39/Cc-public_domain_mark_white.svg" alt="Public Domain Mark" height="48px" align="left" />The contents of the [examples directory](https://github.com/smhxx/atom-ts-transpiler/tree/master/examples) are not subject to the following license, and are freely released into the public domain by their respective authors. These examples are provided as-is with no warranty of any kind, and under no circumstances shall the author(s) be held liable for damages resulting directly or indirectly from their use.

>*Copyright © 2017 "smhxx" (https://github.com/smhxx)*
>
>*Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:*
>
>*The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.*
>
>*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*
