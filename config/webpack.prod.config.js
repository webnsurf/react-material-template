/* eslint-disable @typescript-eslint/no-var-requires */
const CopyWebpackPlugin = require('copy-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { getConfig, PATHS } = require('./webpack.config');

const mainConfig = getConfig('production');

const { GENERATE_BUNDLE_REPORT } = process.env;

/** @type { import('webpack').Configuration } */
module.exports = {
  ...mainConfig,

  mode: 'production',

  output: {
    path: PATHS.dist,
    chunkFilename: '[name].[contenthash].js',
    filename: '[name].[contenthash].js',
    publicPath: '/',
  },

  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'vendors',
        },
      },
    },
  },

  plugins: mainConfig.plugins.concat([
    new CopyWebpackPlugin({
      patterns: [{ from: 'static', to: 'static' }],
    }),

    ...(GENERATE_BUNDLE_REPORT
      ? [
          new BundleAnalyzerPlugin({
            openAnalyzer: false,
            analyzerMode: 'static',
          }),
        ]
      : []),
  ]),
};
