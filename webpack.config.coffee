path = require('path')

webpack           = require('webpack')
BrowserSyncPlugin = require('browser-sync-webpack-plugin')

ROOT = path.resolve(__dirname)

src = './src'
dest = './build'

webpackConfig = {
  entry:
    app: "#{src}/app.coffee"
  output: {
    path:  "#{dest}"
    filename:  "[name].js"
  }
  resolve: {
    extensions: ['', '.js', '.coffee']
  }
  plugins: [
    new BrowserSyncPlugin({
      host: 'localhost'
      port: 3000
      server:
        baseDir: "#{dest}"
      ghostMode: false
      # ghostMode:
      #   clicks: true
      #   forms:  true
      #   scroll: false
    }),
    new webpack.ProvidePlugin({
      riot: 'riot'
    })
  ]

  # debug setting
  debug: true
  devtool: '#source-map'

  module: {
    preLoaders: [
      {
        test:     /\.scss$/
        loader:   "sass"
      }
      {
        test: /\.tag$/,
        exclude: /node_modules/,
        loader: 'riotjs-loader',
        query: { type: 'none', template: 'jade' }
      }
    ]
    loaders: [
      {
        test: /\.js$|\.tag$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      }
      {
        test: /\.coffee$/
        loader: "coffee"
        exclude: /node_modules/,
      }
      {
        test: /\.jade$/
        loader: "html!jade-html?query=true"
      }
      {
        test:     /\.css$|\.scss$/
        loader:   "style!css"
      }
    ]
  } # module

  htmlLoader: {
    minimize: false
    ignoreCustomFragments: [/\{\{.*?}}/]
  }
  postcss: () ->
    [autoprefixer, precss]

  # externals: [
  #   { "wcjs-prebuilt": true }
  # ]
}


module.exports = webpackConfig
