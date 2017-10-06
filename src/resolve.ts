import * as fs from 'fs';
import * as path from 'path';
import { Transpiler, TsConfig } from './defs';

function* searchLocations(baseDir: string, resource: string): IterableIterator<string> {
  let next = baseDir;
  let prev = '';
  while (prev !== next && path.basename(next) !== 'node_modules') {
    yield `${next}/${resource}`;
    prev = next;
    next = path.join(next, '../');
  }
}

function resolveResource(baseDir: string, fileName: string): string | undefined {
  for (const location of searchLocations(baseDir, fileName)) {
    if (fs.existsSync(location)) {
      return location;
    }
  }
  return undefined;
}

export function resolveConfig(baseDir: string): TsConfig.CompilerOptions {
  const location = resolveResource(baseDir, 'tsconfig.json');
  if (location !== undefined) {
    try {
      const contents = fs.readFileSync(location).toString();
      const json = JSON.parse(contents);
      if (typeof json.compilerOptions === 'object') {
        return json.compilerOptions;
      }
    } catch (err) {
      // tslint:disable-next-line no-console
      console.error(`Failed to parse tsconfig located at ${location}.\n
Is your configuration file properly formatted JSON?. Error message was:
\n${err.message}`);
    }
  }
  return {};
}

export function resolveTranspiler(baseDir: string): Transpiler | undefined {
  const location = resolveResource(baseDir, 'node_modules');
  try {
    const transpiler:Transpiler = require(`${location}/typescript`);
    return transpiler;
  } catch (err) {
    console.error(`Failed to load transpiler for directory ${baseDir}.\n
Do you have TypeScript installed as a peerDependency? Error message was:
\n${err.message}`);
    return undefined;
  }
}
