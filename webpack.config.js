var webpack = require('webpack')
var path = require('path')
var fs = require('fs')

var buildPath = path.resolve(__dirname, 'build')
var nodeModulesPath = path.resolve(__dirname, 'node_modules')
var WebpackNotifierPlugin = require('webpack-notifier')

var node_modules = {}
fs.readdirSync('node_modules').forEach(function(module) {
  node_modules[module] = "require('"+module+"')"
})

var config = {
  entry: [path.join(__dirname, '/src/app.js')],
  resolve: {
    //When require, do not have to add these extensions to file's name
    extensions: ['', '.js', '.jsx'],
    // node_modules: ["web_modules", "node_modules"] // (Default Settings)
  },
  target: 'electron',
  //Render source-map file for final build
  devtool: 'source-map',
  //output config
  output: {
    path: buildPath,    //Path of output file
    filename: 'app.js'  //Name of output file
  },
  plugins: [
    // new webpack.IgnorePlugin(/^[(^./|^../)].*/),
    new WebpackNotifierPlugin(),
    //Minify the bundle
    // new webpack.optimize.UglifyJsPlugin({
    //   compress: {
    //     //supresses warnings, usually from module minification
    //     warnings: false
    //   }
    // }),
    // Allows error warnings but does not stop compiling. Will remove when eslint is added
    // new webpack.NoErrorsPlugin(),
  ],
  externals: node_modules,
  module: {
    loaders: [
      {
        test: /\.(js|jsx)$/, //All .js and .jsx files
        loaders: ['babel'],
        exclude: [nodeModulesPath]
      },
      {
        test: /\.vue$/, // a regex for matching all files that end in `.vue`
        loader: 'vue'   // loader to use for matched files
      }
    ]
  },
};

module.exports = config
