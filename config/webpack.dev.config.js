/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

const mainConfig = require('./webpack.config')('development');

/** @type { import('webpack').Configuration } */
module.exports = {
  ...mainConfig,

  mode: 'development',

  output: {
    path: path.resolve(__dirname, '../dist/'),
    publicPath: '/',
    filename: 'bundle.js',
  },

  module: {
    rules: mainConfig.module.rules.concat([
      {
        enforce: 'pre',
        test: /\.js$/,
        loader: 'source-map-loader',
      },
    ]),
  },

  plugins: mainConfig.plugins.concat([
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin({
      overlay: false,
    }),
  ]),

  devServer: {
    port: process.env.PORT,
    hot: true,
    stats: {
      children: false,
    },
    historyApiFallback: true,
    disableHostCheck: true,
    ...(process.env.FROM_DOCKER && {
      host: '0.0.0.0',
      public: `https://${process.env.DEV_URL}`,
    }),
  },

  devtool: 'source-map',
};
