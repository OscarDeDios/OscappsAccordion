const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

const extractSass = new ExtractTextPlugin({
  filename: 'OscappsAccordion.min.css'
})

module.exports = {

  context: path.join(process.cwd(), 'src'),

  devtool: 'source-map',

  entry: {
    app: './index.js'
  },

  output: {
    path: path.join(process.cwd(), 'dist'),
    library: 'OscappsAccordion',
    libraryTarget: 'umd',
    libraryExport: 'default',
    filename: 'OscappsAccordion.min.js',
    publicPath: '.',
    sourceMapFilename: 'OscappsAccordion.map'
  },

  resolve: {
    extensions: ['.js'],
    modules: [path.join(process.cwd(), 'src'), 'node_modules']
  },

  module: {
    rules: [{
      enforce: 'pre',
      test: /\.js$/,
      exclude: /node_modules/,
      loader: 'eslint-loader'
    }, {
      test: /\.js$/,
      exclude: /node_modules/,
      use: {
        loader: 'babel-loader',
        options: {
          presets: ['env']
        }
      }
    }, {
      test: /\.scss$/,
      use: extractSass.extract({
        use: [{
          loader: 'css-loader',
          options: {
            sourceMap: true
          }
        }, {
          loader: 'sass-loader',
          options: {
            sourceMap: true
          }
        }],
        fallback: 'style-loader'
      })
    }]
  },
  plugins: [
    new CleanWebpackPlugin(['dist'], {root: process.cwd()}),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
    extractSass
  ]
}
