const path = require('path')
const webpack = require('webpack')

module.exports = {
  entry: './src/index.js',
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'makeglb.js',
    library: 'MakeGLB'
  },
  devServer: {
    contentBase: path.join(__dirname, 'sample'),
    hot: true,
    port: 3000
  },
  plugins: [
    new webpack.HotModuleReplacementPlugin()
  ]
}
