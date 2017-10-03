[![Travis](https://img.shields.io/travis/smhxx/atom-ts-transpiler.svg)](https://travis-ci.org/smhxx/atom-ts-transpiler)
[![Version](https://img.shields.io/npm/v/atom-ts-transpiler.svg)](https://www.npmjs.com/package/atom-ts-transpiler)
[![Downloads](https://img.shields.io/npm/dt/atom-ts-transpiler.svg)](https://www.npmjs.com/package/atom-ts-transpiler)
# atom-ts-transpiler

This package serves as a simple shim between [Atom](https://atom.io/) and the
[TypeScript](https://www.typescriptlang.org/) transpiler, allowing Atom to run
packages that are written and distributed in TypeScript, using the package's own
TypeScript configuration file. Special thanks go to the folks at GitHub for
making the
[`atom-babel6-transpiler`](https://www.npmjs.com/package/atom-babel6-transpiler)
package, which inspired this attempt to bring TypeScript to a larger portion of
the Atom modding community.

*Also, check out [@types/atom](https://www.npmjs.com/package/@types/atom) from
[DefinitelyTyped](https://github.com/DefinitelyTyped/DefinitelyTyped) to grab
type definitions for your project!*

## Usage

Using `atom-ts-transpiler` is *extremely* simple. Write your package in
TypeScript, then follow these steps to get it running in Atom:

1. Add `atom-ts-transpiler` and `typescript` to your package.json file as
   dependencies (Note: **not** devDependencies) or do
   `npm install --save typescript atom-ts-transpiler`. Specify whichever version
   of TypeScript your project needs in order to work properly; anything >1.6
   should be fine, but older versions *will not* work.
2. Make sure that your package has a
   [tsconfig.json](https://www.typescriptlang.org/docs/handbook/tsconfig-json.html)
   file, and that it builds properly with `tsc` on the command-line. This is
   technically optional, but it makes it much easier to typecheck your code and
   make sure that it compiles sensibly.
3. Add an `atomTranspilers` entry to your package.json file, like so:

```js
{
  "name": "my-super-duper-package",
  "version": "2.1.4",
  // ...
  "atomTranspilers": [
    {
      "glob": "**/*.ts",
      "transpiler": "atom-ts-transpiler",
      "compilerOptions": {
        // Optional. Anything put here will override the
        // settings specified in your tsconfig.json file.
      },
      "cacheKeyFiles": [
        // Optional. File paths put here will cause the entire
        // compile cache to be invalidated when those files change.
      ]
    }
  ]
}
```

And that's it! Now, any time a file matching `glob` is loaded or required at
runtime, Atom will pass it through the TypeScript transpiler, caching the result
until your package is updated or one of the `cacheKeyFiles` changes. It's that
easy!

## License

The source code of this project is released under the
[MIT Expat License](https://opensource.org/licenses/MIT), which freely permits
reuse and redistribution. Feel free to use and/or modify it in any way, provided
that you include this copyright notice with any copies that you make.

*Copyright © 2016 "smhxx" (https://github.com/smhxx)

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.*
