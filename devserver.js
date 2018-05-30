var webpack = require('webpack');
var opn = require('opn');
var WebpackDevServer = require('webpack-dev-server');

var config = require('./webpack.dev');

var port = 8000;
var ip = '0.0.0.0';
new WebpackDevServer(webpack(config), {
  publicPath: config.output.publicPath,
  hot: true,
  historyApiFallback: true,
}).listen(port, ip, function (err) {
  if(err) {
    return console.log(err);
  }

  var uri = 'http://localhost:' + port + '/nl/tool';
  console.log('Listening at ' + uri);
  // opn(uri)
});
