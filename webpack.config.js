var debug = process.env.NODE_ENV !== "production";

var webpack = require('webpack'),
    path = require('path');

var APP_DIR = path.join(__dirname, 'src/react');
var BUILD_DIR = path.join(__dirname, 'src');
var STYLES_DIR = path.join(__dirname, 'src/css');

module.exports = {
  devtool: debug ? "inline-sourcemap" : false,
  entry: path.join(APP_DIR, 'index.jsx'),
  output: {
    path: BUILD_DIR,
    filename: "bundle.min.js"
  },
  module: {
    loaders: [
      {
        test: /\.jsx?$/,
        loader: 'babel-loader',
        include: APP_DIR
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
        include: STYLES_DIR
      }
    ]
  },
  plugins: debug ? [] : [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({ mangle: true, sourcemap: false }),
  ],
  watch: debug ? true : false
};
