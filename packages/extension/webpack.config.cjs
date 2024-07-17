const createConfig = require('./webpack.shared.cjs');

module.exports = createConfig({
  background: ['./src/background-init.ts', './src/background.ts'],
  content: './src/content.ts',
  extension: './src/extension.ts',
  page: './src/page.ts'
});
