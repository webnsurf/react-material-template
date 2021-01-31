/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

const mainConfig = require('./webpack.config')('production');

/** @type { import('webpack').Configuration } */
module.exports = {
  ...mainConfig,

  mode: 'production',

  output: {
    path: path.resolve(__dirname, '../dist'),
    chunkFilename: '[name].[contenthash].js',
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },

  plugins: mainConfig.plugins.concat([
    new CopyWebpackPlugin({
      patterns: [{ from: 'static', to: 'static' }],
    }),
  ]),
};
