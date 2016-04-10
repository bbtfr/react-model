var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'eval',
  entry: './App.js',
  output: {
    path: path.join(__dirname, '..', 'static'),
    filename: 'bundle.js'
  },
  resolve: {
    alias: {
      'react-model': path.join(__dirname, '..', 'src')
    }
  },
  module: {
    loaders: [
      { test: /\.html$|\.json$/, loaders: ['file?name=[name].[ext]'] },
      { test: /\.js$/, loaders: ['babel'] }
    ]
  }
};
