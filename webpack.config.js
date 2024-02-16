const path = require('path')
const webpack = require('webpack')
const dotenv = require('dotenv')

dotenv.config()

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  plugins: [new webpack.EnvironmentPlugin(['CLIENT_ID', 'CLIENT_SECRET', 'CORS_API_HOST'])]
}
