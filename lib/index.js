const fs = require('fs');
const path = require('path');

const concatFiles = pkg => (data, relPath) =>
  `${data}${fs.readFileSync(path.join(pkg.path, relPath))}`;

module.exports = {
  getCacheKeyData(rawSrc, fileName, opts = {}, pkg) {
    return (opts.cacheKeyFiles instanceof Array) ?
      opts.cacheKeyFiles.reduce(concatFiles(pkg), '') : '';
  },

  transpile(rawSrc, fileName, opts = {}) {
    /* eslint-disable global-require */
    const ts = require('typescript');
    const config = require('./config.js');
    /* eslint-enable global-require */
    const moduleName = path.basename(fileName).replace(/\.[^.]*$/, '');
    const tsconfig = config.get(path.dirname(fileName));
    const compilerOptions = Object.apply({}, tsconfig.compilerOptions, opts);
    let code;
    try {
      const fileSrc = fs.readFileSync(fileName, 'utf8');
      const result = ts.transpileModule(fileSrc, { compilerOptions, fileName, moduleName });
      code = result.outputText;
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Encountered an error while attempting to transpile module ${moduleName} from path ${fileName}:\n\n${err.message}`);
    }
    return { code };
  },
};
