import resolve from './resolve';
import { Transpiler } from './defs';

export default {
  resolve: (baseDir: string): Transpiler | null => {
    const location = resolve(baseDir, 'node_modules');
    try {
      return require(`${location}/typescript`);
    } catch (err) {
      // tslint:disable-next-line max-line-length
      console.error(`Failed to load transpiler for directory ${baseDir}.\nDo you have TypeScript installed as a peerDependency? Error message was:\n${err.message}`);
      return null;
    }
  },
};
