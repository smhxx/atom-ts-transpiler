import * as fs from 'fs';
import * as path from 'path';
import { TsConfig } from './defs';

const hasOwnObjectProperty = (o: Record<string, any>, property: string) =>
  o.hasOwnProperty(property) && typeof o[property] === 'object' && !Array.isArray(o[property]);

function compose(...objects: Record<string, any>[]): Record<string, any> {
  const newObj = Object.assign({}, ...objects);
  for (const property in objects[0]) {
    if (hasOwnObjectProperty(objects[0], property)) {
      newObj[property] = compose(...(objects.map(o => o[property])));
    }
  }
  return newObj;
}

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
    // tslint:disable-next-line max-line-length
    console.error(`Failed to parse tsconfig located at ${location}.\nIs your configuration file properly formatted JSON?. Error message was:\n${err.message}`);
    return {};
  }
}

type ChildConfig = TsConfig & { extends: string };

function isChildConfig(config: TsConfig): config is ChildConfig {
  return typeof config.extends === 'string';
}

// tslint:disable-next-line max-line-length
function getParentConfig(config: ChildConfig, location: string, descendants: Set<string>): TsConfig {
  const parent = path.resolve(path.dirname(location), config.extends);
  if (descendants.has(parent)) {
    // tslint:disable-next-line max-line-length
    console.warn(`The tsconfig file at ${location} attempts to extend ${parent}, but this file already inherits from it. This circular reference will be ignored.`);
    return {};
  }
  return load(parent, descendants.add(location));
}

export function load(location: string, descendants: Set<string> = new Set()): TsConfig {
  const config = readJSON(location);
  if (isChildConfig(config)) {
    const parent = getParentConfig(config, location, descendants);
    return Object.assign(compose(parent, config), { extends: undefined });
  }
  return config;
}
