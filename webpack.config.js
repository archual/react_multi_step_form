'use strict';
var pkg = require('./package.json');
const path = require('path');
// const HtmlWebpackPlugin = require('html-webpack-plugin');

const merge = require('webpack-merge');
const validate = require('webpack-validator');

const parts = require('./lib/parts');

const PATHS = {
  app: path.join(__dirname, 'app'),
  build: path.join(__dirname, 'build')
};


const common = {
  entry: [
    PATHS.app
  ],
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  output: {
    path: PATHS.build,
    filename: '[name].js'
  },
  plugins: []
};

var config;

switch (process.env.npm_lifecycle_event) {
  case 'build':
    config = merge(
      common,
      {
        entry: {
          app: PATHS.app,
          vendor: Object.keys(pkg.dependencies)
        },
        output: {
          path: PATHS.build,
          filename: '[name].js?'
        }
      },
      parts.loadImages({
        options: {
          limit: 50000,
          name: '[name].[ext]',
        },
      }),
      parts.setupCSS(),
      parts.optimizeChunk('vendor'),
      parts.minify(),
      parts.polyfills(),
      parts.setupBabel(PATHS.app),
      parts.env()
    );
    break;
  default:
    config = merge(
      common,
      parts.polyfills(),
      parts.loadImages(),
      parts.setupCSS(),
      parts.setupBabel(PATHS.app),
      parts.generateSourceMaps({
        type: "cheap-module-eval-source-map"
      }),
      parts.devServer({
        historyApiFallback: true,
        host: '192.168.1.174',
        port: '8080'
      })
    );
}

module.exports = validate(config);
