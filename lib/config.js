const fs = require('fs');
const path = require('path');

const configCache = new Map();

const findConfigFile = (filePath) => {
  let dir = path.dirname(filePath);
  let prev;
  while (dir !== prev && path.basename(dir) !== 'node_modules') {
    if (fs.existsSync(`${dir}/tsconfig.json`)) {
      return path.join(dir, 'tsconfig.json');
    }
    prev = dir;
    dir = path.join(dir, '../');
  }
  return undefined;
};

const readConfigFile = (configPath) => {
  let data = {};
  if (configPath) {
    try {
      data = JSON.parse(fs.readFileSync(configPath));
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Encountered an error while attempting to read compiler options from tsconfig file ${configPath}:\n\n${err.message}`);
    }
  }
  return data;
};

module.exports = {
  get: (filePath) => {
    const dir = path.dirname(filePath);
    let config = configCache.get(dir);
    if (!config) {
      const configPath = findConfigFile(filePath);
      config = readConfigFile(configPath);
      configCache.set(dir, config);
    }
    return config;
  },
};
