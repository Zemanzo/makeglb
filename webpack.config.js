const path = require('path')
const webpack = require('webpack')

module.exports = (env, argv) => {
  const debug = argv.mode !== 'production'

  const plugins = []
  if (debug) {
    plugins.push(new webpack.HotModuleReplacementPlugin())
  }

  return {
    entry: './src/index.js',
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: 'makeglb.js',
      library: 'MakeGLB',
      libraryTarget: 'commonjs2',
      globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    target: 'node',
    devServer: {
      contentBase: path.join(__dirname, 'sample'),
      hot: true,
      port: 3000
    },
    plugins: plugins
  }
}
