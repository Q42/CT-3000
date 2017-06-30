var path = require('path');
var autoprefixer = require('autoprefixer');
var webpack = require('webpack');
var HtmlWebpackPlugin = require('html-webpack-plugin');

process.traceDeprecation = true;

module.exports = {
  context: __dirname + '/src',
  entry: {
    javascript: [
      'webpack-dev-server/client?http://localhost:8000',
      './main.js'
    ],
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
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader',
        query: {
          presets: ['es2015','react']
        }
      },
      {
        test: /\.svg$/,
        loader: 'file-loader',
        options: {
          name: 'svg/[name].[ext]',
        }
      },
      {
        test: /\.html$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        }
      },
      {
        test: /\.(less|css)$/,
        use: [
          { loader: 'style-loader' },
          { loader: 'css-loader' },
          { loader: 'postcss-loader', options: { plugins: function(loader) { return [ autoprefixer() ] } } },
          { loader: 'less-loader' },
        ],
      },
      {
        test: /\.(png|jpg|jpeg|gif|woff)$/,
        loader: 'file-loader',
        options: {
          name: 'img/img-[hash:6].[ext]',
        }
      }
    ],
  },

  plugins: [ 
    new HtmlWebpackPlugin({
      title: 'CT-3000 - Learn to code',
      favicon: 'favicon.ico',
      hash: true,
      template: 'index-template.ejs',
    })
  ]

};
