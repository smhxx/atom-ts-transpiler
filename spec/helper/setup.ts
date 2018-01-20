const r = require('fs').readFileSync;
require('ts-node').register({
  compilerOptions: JSON.parse(r('./spec/tsconfig.json')).compilerOptions,
});
