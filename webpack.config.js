const path = require('path')
const webpack = require('webpack')

module.exports = {
  mode: 'development',
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new webpack.DefinePlugin({ 'process.env': JSON.stringify(require('dotenv').config().parsed) })]
}
