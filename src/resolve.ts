import * as fs from 'fs';
import * as path from 'path';
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

function removeComments(source: string) {
  return source.replace(/\/\/.*|\/\*[^]*?\*\//g, ' ');
}

function readJSON(location: string) {
  let file = location;
  if (!fs.existsSync(file) && !file.endsWith('.json')) file += '.json';
  const content = fs.readFileSync(file, 'utf8');
  const json = removeComments(content);
  return JSON.parse(json);
}

function loadConfig(location: string, files: Set<string> = new Set): TsConfig {
  let config;
  try {
    config = readJSON(location);
  } catch (err) {
    // tslint:disable-next-line no-console
    console.error(`Failed to parse tsconfig located at ${location}.\n
Is your configuration file properly formatted JSON?. Error message was:
\n${err.message}`);
  }
  if (config == null || typeof config !== 'object') return {};
  return config;
}

export function resolveConfig(baseDir: string): TsConfig.CompilerOptions {
  const location = resolveResource(baseDir, 'tsconfig.json');
  if (location === undefined) return {};
  const { compilerOptions } = loadConfig(location);
  return compilerOptions === undefined ? {} : compilerOptions;
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
