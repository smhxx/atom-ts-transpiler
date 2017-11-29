import * as fs from 'fs';
import * as path from 'path';
import { loadConfig } from './config';
import { Transpiler, TsConfig } from './defs';

function* searchLocations(baseDir: string, resource: string): IterableIterator<string> {
  let next = baseDir;
  let prev = '';
  while (prev !== next && path.basename(next) !== 'node_modules') {
    yield path.join(next, resource);
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

export function resolveConfig(baseDir: string): TsConfig {
  const location = resolveResource(baseDir, 'tsconfig.json');
  if (location !== undefined) {
    return loadConfig(location);
  } else {
    return {};
  }
}

export function resolveTranspiler(baseDir: string): Transpiler | undefined {
  const location = resolveResource(baseDir, 'node_modules');
  try {
    return require(`${location}/typescript`);
  } catch (err) {
    console.error(`Failed to load transpiler for directory ${baseDir}.\n
Do you have TypeScript installed as a peerDependency? Error message was:
\n${err.message}`);
    return undefined;
  }
}
