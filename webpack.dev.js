const merge = require('webpack-merge');
const common = require('./webpack.common.js');
var webpack = require('webpack');

module.exports = merge(common, {
  // mode: 'development',
  entry: {
    javascript: [
      'webpack-dev-server/client?http://localhost:8000',
      'webpack/hot/only-dev-server', // "only" prevents reload on syntax errors
      './main.js'
    ],
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin(),
  ]
});
