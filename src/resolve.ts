import * as fs from 'fs';
import * as path from 'path';

function* searchLocations(baseDir: string, resource: string): IterableIterator<string> {
  let next = baseDir;
  let prev = '';
  while (prev !== next && path.basename(next) !== 'node_modules') {
    yield path.join(next, resource);
    prev = next;
    next = path.join(next, '../');
  }
}

export default function resolve(baseDir: string, fileName: string): string | undefined {
  for (const location of searchLocations(baseDir, fileName)) {
    if (fs.existsSync(location)) {
      return location;
    }
  }
  return undefined;
}
