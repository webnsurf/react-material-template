/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const PATHS = {
  entry: path.join(__dirname, '../source/index'),
  source: path.join(__dirname, '../source'),
  dist: path.join(__dirname, '../dist'),
  nodeModules: path.join(__dirname, '../node_modules'),
};

module.exports = {
  PATHS,
  /** @type { (env: 'production' | 'development') => import('webpack').Configuration } */
  getConfig: env => ({
    entry: PATHS.entry,
    resolve: {
      modules: [PATHS.nodeModules, PATHS.source],
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'babel-loader',
          ...(env === 'developmetn' && {
            options: { plugins: [require.resolve('react-refresh/babel')] },
          }),
        },
        {
          test: /\.tsx?$/,
          enforce: 'post',
          use: [{ loader: 'baggage-loader?{"[file].scss":{}}' }],
        },
        {
          test: /\.css$/,
          use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
        },
        {
          test: /\.scss$/,
          use: [
            {
              loader: 'style-loader',
            },
            {
              loader: 'css-loader',
              ...(env === 'development' && { options: { sourceMap: true } }),
            },
            {
              loader: 'sass-loader',
            },
          ],
        },
        {
          test: /.(png|jpg|jpeg|gif|woff|woff2|ttf|eot)$/,
          use: 'url-loader?limit=100000',
        },
        {
          test: /\.svg$/,
          use: 'react-svg-loader',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, '../index.html'),
        filename: 'index.html',
      }),
      new webpack.ProvidePlugin({ process: 'process' }),
    ],
  }),
};
