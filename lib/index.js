const fs = require('fs');
const path = require('path');
const ts = require('typescript');
const config = require('./config.js');

const concatFiles = pkg => (data, relPath) =>
  `${data}${fs.readFileSync(path.join(pkg.path, relPath))}`;

module.exports = {
  getCacheKeyData(source, filePath, opts = {}, pkg) {
    return (opts.cacheKeyFiles instanceof Array) ?
      opts.cacheKeyFiles.reduce(concatFiles(pkg), '') : '';
  },

  transpile(source, filePath, opts = {}) {
    const moduleName = path.basename(filePath).replace(/\.[^.]*$/, '');
    const tsconfig = config.get(path.dirname(filePath));
    const compilerOptions = Object.apply({}, tsconfig.compilerOptions, opts);
    let code;
    try {
      const src = fs.readFileSync(filePath, 'utf8');
      code = ts.transpile(src, compilerOptions, filePath, [], moduleName);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Encountered an error while attempting to transpile module ${moduleName} from path ${filePath}:\n\n${err.message}`);
    }
    return { code };
  },
};
