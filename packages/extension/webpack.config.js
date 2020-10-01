const path = require('path');
const webpack = require('webpack');

const CopyPlugin = require('copy-webpack-plugin');
const ManifestPlugin = require('webpack-extension-manifest-plugin');

const pkgJson = require('./package.json');
const manifest = require('./manifest.json');

function createWebpack ({ alias = {}, context }) {
  const ENV = process.env.NODE_ENV || 'development';
  const isProd = ENV === 'production';

  return {
    context,
    devtool: false,
    entry: {
      background: './src/background.ts',
      content: './src/content.ts',
      extension: './src/extension.ts',
      page: './src/page.ts'
    },
    mode: ENV,
    module: {
      rules: [
        {
          exclude: /(node_modules)/,
          test: /\.(js|ts|tsx)$/,
          use: [
            require.resolve('thread-loader'),
            {
              loader: require.resolve('babel-loader'),
              options: require('@polkadot/dev/config/babel')
            }
          ]
        },
        {
          test: [/\.svg$/, /\.bmp$/, /\.gif$/, /\.jpe?g$/, /\.png$/, /\.woff2?$/],
          use: [
            {
              loader: require.resolve('url-loader'),
              options: {
                esModule: false,
                limit: 10000,
                name: 'static/[name].[ext]'
              }
            }
          ]
        },
        {
          test: /\.css$/,
          loader: 'raw-loader'
        }
      ]
    },
    node: {
      child_process: 'empty',
      dgram: 'empty',
      fs: 'empty',
      net: 'empty',
      tls: 'empty'
    },
    optimization: {
      concatenateModules: false,
      moduleIds: 'natural',
      occurrenceOrder: false,
      providedExports: false,
      sideEffects: false,
      usedExports: false
    },
    output: {
      chunkFilename: '[name].js',
      filename: '[name].js',
      globalObject: '(typeof self !== \'undefined\' ? self : this)',
      path: path.join(context, 'build')
    },
    performance: {
      hints: false
    },
    plugins: [
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
      new webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(ENV),
          PKG_NAME: JSON.stringify(pkgJson.name),
          PKG_VERSION: JSON.stringify(pkgJson.version)
        }
      }),
      new CopyPlugin({ patterns: [{ from: 'public' }] }),
      new ManifestPlugin({
        config: {
          base: manifest,
          extend: {
            version: pkgJson.version.split('-')[0] // remove possible -beta.xx
          }
        }
      })
    ].filter((entry) => entry),
    resolve: {
      alias,
      extensions: ['.js', '.jsx', '.ts', '.tsx']
    },
    watch: !isProd
  };
}

const alias = {
  '@polymathnetwork/extension': path.resolve(__dirname, '../extension/src'),
  '@polymathnetwork/extension-ui': path.resolve(__dirname, '../ui/src'),
  '@polymathnetwork/extension-core': path.resolve(__dirname, '../core/src')
};

module.exports = createWebpack({
  alias,
  context: __dirname
});
