var path = require('path');

module.exports = {
  entry: './src/sequmise.js',
  mode: 'development',
  output: {
    filename: 'sequmise.js',
    library: 'sequmise',
    libraryTarget: 'umd',
    path: path.resolve(__dirname, 'dist'),
    globalObject: 'this'
  },
  devtool: 'source-map',
  module: {
    rules: [{
      test: /\.js$/,
      exclude: /node_modules/,
      loader: "babel-loader"
    }]
  }
}