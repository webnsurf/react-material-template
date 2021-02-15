/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

/** @type { () => import('webpack').Configuration } */
module.exports = env => ({
  entry: path.resolve(__dirname, '../source/index'),
  resolve: {
    modules: ['node_modules', path.resolve(__dirname, '../source')],
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
        test: /.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
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
    new MonacoWebpackPlugin({
      // available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
      languages: ['html'],
    }),
  ],
});
