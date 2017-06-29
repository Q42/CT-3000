var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');

module.exports = {
  context: __dirname + '/src',
  entry: {
    javascript: [
      'webpack-dev-server/client?http://localhost:8000',
      './main.js'
    ],
    html: './index.html',
  },

  output: {
    path: path.resolve(__dirname + '/dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },

  // only use on production
  // plugins: [
  //   new webpack.DefinePlugin({
  //     'process.env': {
  //       NODE_ENV: JSON.stringify('production')
  //     }
  //   }),
  //   new webpack.optimize.UglifyJsPlugin()
  // ],

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel',
        query: {
          presets: ['es2015','react']
        }
      },
      {
        test: /\.svg$/,
        loader: 'file?name=svg/[name].[ext]'
      },
      {
        test: /\.html$/,
        loader: 'file?name=[name].[ext]',
      },
      {
        test: /\.(less|css)$/,
        loader: 'style!css!postcss!less'
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff)$/,
        loader: 'file?name=img/img-[hash:6].[ext]'
      }
    ],
  },
  postcss: function () {
    return [autoprefixer];
  }
};
