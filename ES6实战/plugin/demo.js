const { transformSync } = require('@babel/core');
const plugin = require('./index');

const output = transformSync(code, options);