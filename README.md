[![Version](https://img.shields.io/apm/v/atom-ts-transpiler.svg)](https://atom.io/packages/atom-ts-transpiler)
[![Downloads](https://img.shields.io/apm/dm/atom-ts-transpiler.svg)](https://atom.io/packages/atom-ts-transpiler)
# atom-ts-transpiler

This package serves as a simple shim between Atom and the TypeScript transpiler,
allowing Atom to run packages that are written and distributed in TypeScript,
using the package's own `tsconfig.json` file. Special thanks go to the
maintainers of the `atom-babel6-transpiler` package, which inspired this attempt
to bring TypeScript to a larger portion of the Atom modding community.

## Usage

Using `atom-ts-transpiler` is *extremely* simple. Write your package in
TypeScript, then follow these steps to get it running in Atom:

1. Add `atom-ts-transpiler` to your package.json file as a dependency (Note:
   **not** a devDependency) or do `npm install --save atom-ts-transpiler`.
2. Make sure that your package has a tsconfig.json file, and that it builds
   properly with `tsc` on the command-line. This is technically optional, but
   it makes it much easier to typecheck your code and make sure that it compiles
   correctly.
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
      }
    }
  ]
}
```

4. And that's it! Atom will now run any .ts files in your package through
   TypeScript as they are `require`d at runtime, converting them into compatible
   JavaScript.

## License

The source code of this project is released under the MIT License, which
freely permits reuse and redistribution. Feel free to use and/or modify
it in any way, provided that you include this copyright notice with any copies
that you make.

```text
Copyright (c) 2016 "smhxx" (https://github.com/smhxx)

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
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
```
