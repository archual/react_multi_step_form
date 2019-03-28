const webpack = require("webpack");

var devFlagPlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.DEBUG || "false"))
});

exports.devServer = function(options) {
  return {
    devServer: {
      // publicPath: 'http://192.168.1.174:8080/',
      contentBase: "http://localhost/",
      // Enable history API fallback so HTML5 History API based
      // routing works. This is a good default that will come
      // in handy in more complicated setups.
      historyApiFallback: true,

      // Unlike the cli flag, this doesn't set
      // HotModuleReplacementPlugin!
      hot: true,
      inline: true,
      // progress: true,

      // Display only errors to reduce the amount of output.
      stats: "errors-only",

      // Parse host and port from env to allow customization.
      //
      // If you use Vagrant or Cloud9, set
      // host: options.host || '0.0.0.0';
      //
      // 0.0.0.0 is available to all network devices
      // unlike default `localhost`.
      host: options.host, // Defaults to `localhost`
      // host: (options.host === '0.0.0.0') ? location.hostname : options.host,
      port: 8085 // Defaults to 8080
    },
    plugins: [
      // Enable multi-pass compilation for enhanced performance
      // in larger projects. Good default.
      new webpack.HotModuleReplacementPlugin({
        multiStep: true
      }),
      devFlagPlugin
    ]
  };
};

exports.setupCSS = function(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.css$/,
          use: [
            {
              loaders: ["style", "css"],
              include: paths
            }
          ]
        }
      ]
    }
  };
};

exports.minify = function() {
  return {
    plugins: [
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false
        }
      })
    ]
  };
};

exports.env = function() {
  return {
    plugins: [new webpack.EnvironmentPlugin(["NODE_ENV"])]
  };
};

exports.setupBabel = function(paths) {
  return {
    module: {
      rules: [
        {
          test: /\.jsx?$/,
          use: [
            {
              loaders: ["babel"],
              include: paths
            }
          ]
        },
        {
          test: /\.json$/,
          use: [
            {
              loader: "json"
            }
          ]
        },
        {
          test: /\.less$/,
          use: [
            {
              loader: "less-loader",
              options: {
                javascriptEnabled: true
              }
            }
          ]
        }
      ]
    }
  };
};

exports.loadImages = function({ include, exclude, options } = {}) {
  return {
    module: {
      rules: [
        {
          test: /\.(png|jpg|gif|svg)$/,
          use: [
            {
              loader: "url-loader"
            }
          ]
        }
      ]
    }
  };
};

exports.optimizeChunk = function(chunk) {
  return {
    plugins: [new webpack.optimize.CommonsChunkPlugin(chunk, "[name].js")]
  };
};

exports.polyfills = function() {
  return {
    plugins: [
      new webpack.ProvidePlugin({
        Promise: "es6-promise",
        fetch: "imports?this=>global!exports?global.fetch!whatwg-fetch"
      })
    ]
  };
};

exports.generateSourceMaps = function({ type }) {
  return {
    devtool: type
  };
};
