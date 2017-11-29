import * as fs from 'fs';
import * as path from 'path';
import { TsConfig } from './defs';

function removeComments(source: string): string {
  return source.replace(/\/\*[\s\S]*?\*\/|([^\\:]|^)\/\/.*$/gm, '$1');
}

function readJSON(location: string): TsConfig {
  let file = location;
  if (!fs.existsSync(file) && !file.endsWith('.json')) file += '.json';
  try {
    const content = fs.readFileSync(file, 'utf8');
    const json = removeComments(content);
    return JSON.parse(json);
  } catch (err) {
    // tslint:disable-next-line no-console
    console.error(`Failed to parse tsconfig located at ${location}.\n
Is your configuration file properly formatted JSON?. Error message was:
\n${err.message}`);
    return {};
  }
}

function getParentConfig(config: TsConfig, location: string, descendants: Set<string>): TsConfig {
  const parent = path.resolve(path.dirname(location), config.extends);
  if (descendants.has(parent)) {
    console.warn(`The tsconfig file at ${location} attempts to extend ${parent}, but this file
already inherits from it. This circular reference will be ignored.`);
    return {};
  } else {
    return loadConfig(parent, descendants.add(location));
  }
}

export function loadConfig(location: string, descendants: Set<string> = new Set): TsConfig {
  const config = readJSON(location);
  if (config.extends !== undefined) {
    const parent = getParentConfig(config, location, descendants);
    return Object.assign(parent, config, {
      compilerOptions: Object.assign({}, parent.compilerOptions, config.compilerOptions),
      extends: undefined,
    });
  } else {
    return config;
  }
}
