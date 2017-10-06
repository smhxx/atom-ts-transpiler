import * as path from 'path';
import { Transpiler } from './defs';
import { resolveConfig, resolveTranspiler } from './resolve';

interface CacheEntry {
  options: Transpiler.Options;
  transpiler?: Transpiler;
}

const cache = new Map<string, CacheEntry>();

function initCache(dir: string): CacheEntry {
  const entry = {
    options: resolveConfig(dir),
    transpiler: resolveTranspiler(dir),
  };
  cache.set(dir, entry);
  return entry;
}

export function getCache(file: string): CacheEntry {
  const dir = path.dirname(file);
  const entry = cache.get(dir);
  if (entry !== undefined) {
    return entry;
  } else {
    return initCache(dir);
  }
}
