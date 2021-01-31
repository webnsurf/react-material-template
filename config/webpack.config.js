/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const fs = require('fs');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');
const ts = require('typescript');

const PATHS = {
  entry: path.join(__dirname, '../source/index'),
  source: path.join(__dirname, '../source'),
  dist: path.join(__dirname, '../dist'),
  nodeModules: path.join(__dirname, '../node_modules'),
};

const themePath = path.join(PATHS.source, 'theme.js');
const themeFile = fs.readFileSync(path.join(PATHS.source, 'theme.ts'), 'utf-8');
fs.writeFileSync(themePath, ts.transpile(themeFile));

/** @type { import('../source/theme') } */
const theme = require(themePath); // eslint-disable-line import/no-dynamic-require

/** @type { () => import('webpack').Configuration } */
module.exports = (env) => ({
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
        test: /\.less$/,
        use: [
          { loader: 'style-loader' },
          {
            loader: 'css-loader',
            ...(env === 'development' && { options: { sourceMap: true } }),
          },
          {
            loader: 'less-loader',
            options: {
              lessOptions: {
                javascriptEnabled: true,
                modifyVars: {
                  'primary-color': theme.colors.primary,
                  'text-color': theme.colors.text,
                  'error-color': theme.colors.error,
                  'link-color': 'none',
                  'link-hover-color': 'none',
                  'link-active-color': 'none',
                },
              },
            },
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
