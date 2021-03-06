// By default eslint assumes packages imported are supposed to be dependencies,
// not devDependencies. Disabling this rule in webpack.conig.js
/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack');

const path = require('path');
const Autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    'terra-clinical': path.resolve(path.join(__dirname, 'src', 'Index')),
  },
  module: {
    loaders: [
      {
        test: /\.(jsx|js)$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
      },
      {
        test: /\.json$/,
        loader: 'json-loader',
      },
      {
        test: /\.(scss|css)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [{
            loader: 'css-loader',
          }, {
            loader: 'postcss-loader',
            options: {
              plugins() {
                return [
                  Autoprefixer({
                    browsers: [
                      'ie >= 10',
                      'last 2 versions',
                      'last 2 android versions',
                      'last 2 and_chr versions',
                      'iOS >= 8',
                    ],
                  }),
                ];
              },
            },
          }, {
            loader: 'sass-loader',
            options: {
              data: `@import "${path.resolve(path.join(__dirname, 'node_modules/terra-legacy-theme/lib/LegacyTheme.scss'))}"; $terra-bidi: true;`,
            },
          }],
        }),
      },
      {
        test: /\.md$/,
        loader: 'raw-loader',
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('[name]-[hash].css'),
    new HtmlWebpackPlugin({
      template: path.join(__dirname, 'src', 'index.html'),
      chunks: ['terra-clinical'],
    }),
    new webpack.NamedChunksPlugin(),
  ],
  resolve: {
    // See https://github.com/facebook/react/issues/8026
    extensions: ['.js', '.jsx'],
    alias: {
      moment: path.resolve(__dirname, 'node_modules/moment'),
      react: path.resolve(__dirname, 'node_modules', 'react'),
      'react-intl': path.resolve(__dirname, 'node_modules/react-intl'),
      'react-dom': path.resolve(__dirname, 'node_modules/react-dom'),
    },
  },
  output: {
    filename: '[name].js',
    path: path.join(__dirname, 'dist'),
  },
  devtool: 'cheap-source-map',
  devServer: {
    host: '0.0.0.0',
    disableHostcheck: true,
    stats: {
      assert: true,
      children: false,
      chunks: false,
      hash: false,
      modules: false,
      publicPath: false,
      timings: true,
      version: true,
      warnings: true,
    },
    overlay: {
      warnings: true,
      errors: true,
    },
  },
  resolveLoader: {
    modules: [path.resolve(path.join(__dirname, 'node_modules'))],
  },
};
