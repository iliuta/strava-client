const path = require('path');

var webpack = require('webpack');

module.exports = {
  entry: {
    app: './src/js/app.js',
    appReact: './src/js/app.jsx',
    static: './src/js/static.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, '../../../target/classes/static/dist')
  },
  plugins: [
          new webpack.ProvidePlugin({
              $: "jquery",
              jQuery: "jquery",
              "windows.jQuery": "jquery"
          })
      ],
   module: {
       rules: [
         {
           test: /\.jsx$/,
           exclude: /(node_modules)/,
           loader: 'babel-loader',
           query: {
               cacheDirectory: true,
               presets: ['es2015', 'react']
           }
         },
         {
           test: /\.css$/,
           use: [
             'style-loader',
             'css-loader'
           ]
         },
         {
            test: /\.(png|svg|jpg|gif)$/,
            use: [
              {
                loader: 'file-loader',
                 options: {
                    'publicPath': 'dist/'
                }
              }
            ]
         },
         {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            use: [
            {
              loader: 'file-loader',
              options: {
                'publicPath': 'dist/'
              }
              }
            ]
         },
         {
            test: /\.(html)$/,
            use: [
            {
              loader: 'file-loader',
              options: {
                'publicPath': 'dist/',
                'name': '[name].[ext]'
              }
              }
            ]
         }
       ]
     }
};
