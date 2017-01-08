'use strict';

const Path = require('path')
const Webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ExtractSASS = new ExtractTextPlugin('styles/bundle.css');

module.exports = (options) => {

  let webpackConfig = {
    devtool: options.devtool,
    entry: [
      `webpack-dev-server/client?http://localhost:${options.port}`,
      'webpack/hot/dev-server',
      './frontend/scripts/index'
    ],
    output: {
      path: Path.join(__dirname, 'web', 'dist'),
      filename: 'bundle.js'
    },
    plugins: [
      new Webpack.DefinePlugin({
        'process.env': {
          NODE_ENV: JSON.stringify(options.isProduction ? 'production' : 'development')
        }
      }),
      new HtmlWebpackPlugin({
        template: './frontend/index.html'
      })
    ],
    module: {
      loaders: [
        {
          test: /\.jsx?$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel',
          query: {
            presets: ['react', 'es2015']
          }
        },
        {
            test: /\.(eot|svg|ttf|woff(2)?)(\?v=\d+\.\d+\.\d+)?/,
            loader: 'url'
        }
      ]
    }
  };

  if (options.isProduction) {
    webpackConfig.entry = ['./frontend/scripts/index'];

    webpackConfig.plugins.push(
      new Webpack.optimize.OccurenceOrderPlugin(),
      new Webpack.optimize.UglifyJsPlugin({
        compressor: {
          warnings: false
        }
      }),
      ExtractSASS
    );

    webpackConfig.module.loaders.push({
      test: /\.s?css$/i,
      loader: ExtractSASS.extract(['css', 'sass'])
    });

  } else {
    webpackConfig.plugins.push(
      new Webpack.HotModuleReplacementPlugin()
    );

    webpackConfig.module.loaders.push({
      test: /\.s?css$/i,
      loaders: ['style', 'css', 'sass']
    }, {
      test: /\.js$/,
      loader: 'eslint',
      exclude: /node_modules/
    });

    webpackConfig.devServer = {
      contentBase: './web/dist',
      hot: true,
      port: options.port,
      inline: true,
      progress: true
    };
  }

  return webpackConfig;

}
