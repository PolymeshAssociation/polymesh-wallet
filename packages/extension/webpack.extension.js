const createConfig = require('./webpack.shared.js');

module.exports = createConfig(
  {
    extension: './src/extension.ts'
  }
);
