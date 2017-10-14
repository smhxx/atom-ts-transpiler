[![Travis](https://img.shields.io/travis/smhxx/atom-ts-transpiler/master.svg)](https://travis-ci.org/smhxx/atom-ts-transpiler)
[![Version](https://img.shields.io/npm/v/atom-ts-transpiler.svg)](https://www.npmjs.com/package/atom-ts-transpiler)
[![Downloads](https://img.shields.io/npm/dt/atom-ts-transpiler.svg)](https://www.npmjs.com/package/atom-ts-transpiler)
[![CodeClimate](https://img.shields.io/codeclimate/github/smhxx/atom-ts-transpiler.svg)](https://codeclimate.com/github/smhxx/atom-ts-transpiler)
[![Coverage](https://img.shields.io/codeclimate/coverage/github/smhxx/atom-ts-transpiler.svg)](https://codeclimate.com/github/smhxx/atom-ts-transpiler/code)
[![Greenkeeper](https://badges.greenkeeper.io/smhxx/atom-ts-transpiler.svg)](https://greenkeeper.io/)
# atom-ts-transpiler

This package serves as a simple compatibility layer between [Atom](https://atom.io/) and the [TypeScript](https://www.typescriptlang.org/) transpiler, allowing Atom to run packages that are written and distributed in TypeScript using the package's own TypeScript configuration file. Special thanks go to the folks at GitHub for making the [`atom-babel6-transpiler`](https://www.npmjs.com/package/atom-babel6-transpiler) package, which inspired this attempt to bring TypeScript to a larger portion of the Atom modding community.

## Usage

Using `atom-ts-transpiler` is *extremely* simple. Write your package in TypeScript, then follow these steps to get it running in Atom:

1. Add `atom-ts-transpiler` and `typescript` to your package.json file as dependencies (Note: **not** devDependencies) or do `npm install --save typescript atom-ts-transpiler`. You can specify whichever version of TypeScript your project needs in order to work properly; anything >1.6 should be fine, but older versions *will not* work.
2. Make sure that your package has a [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html) file, and that it builds properly with `tsc` on the command-line. This is technically optional, but it makes it much easier to typecheck your code and make sure that it compiles sensibly.
3. Add an `atomTranspilers` entry to your package.json file, like so:

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
        "compilerOptions": {
          // Optional. Anything put here will override the
          // compilerOptions specified in your tsconfig.json.
        },
        "cacheKeyFiles": [
          // Optional. File paths listed here will be watched for
          // changes, which will cause the package to be recompiled.
        ],
        "verbose": false // Optional. If set to true, will enable additional console output.
      }
    }
  ]
}
```

And that's it! Now, any time a file matching `glob` is loaded or required at runtime, Atom will pass it through the TypeScript transpiler, caching the result until your package is updated or one of the `cacheKeyFiles` changes. It's that easy!

*(Note: The glob shown above matches all .ts and .tsx files **not** within the package's node_modules directory. This should be appropriate for 99% of packages, but can be modified if necessary.)*

### Peer Dependencies

#### Required Peer Dependencies

* [typescript](https://www.npmjs.com/package/typescript): *Any version 1.6 or later should be compatible, but versions older than 1.6 definitely **will not** work. Use whichever version you need in order for your package to compile properly (although, of course, more recent versions are usually preferable.)*

#### Recommended Peer Dependencies

* [@types/atom](https://www.npmjs.com/package/@types/atom): *TypeScript definitions for the [Atom API](https://atom.io/docs/api/v1.21.0/AtomEnvironment), maintained as part of the [DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) project.*

#### Optional "Peer Dev Dependencies"

* [atom-transpiler-debug-tool](https://www.npmjs.com/package/atom-transpiler-debug-tool): *A convenient script for inspecting the state of the Atom compile cache, which can help isolate issues in projects that use custom transpilers.*
* [atom-mocha-test-runner](https://www.npmjs.com/package/atom-mocha-test-runner): *An alternate test runner for Atom packages, which (with some tinkering) can be configured to run tests written in TypeScript.*
* [@types/atom-mocha-test-runner](https://www.npmjs.com/package/@types/atom-mocha-test-runner): *Additional type definitions for `atom-mocha-test-runner`.*

### Example Projects

If your package uses `atom-ts-transpiler`, we'd love to hear from you so we can show off your project here! (Just open an issue or PR on GitHub! 😊) If you're hesitant to make the switch, future patch versions will also likely include some minimal example setups to get you started.

<!-- * [your-package-name](https://atom.io/packages/your-package-name): *A brief description of what it does.* -->

## License

The source code of this project is released under the [MIT Expat License](https://opensource.org/licenses/MIT), which freely permits reuse and redistribution. Feel free to use and/or modify it in any way, provided that you include this copyright notice with any copies that you make.

*Copyright © 2016 "smhxx" (https://github.com/smhxx)*

*Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:*

*The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.*

*THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*
