const path = require('path');

var webpack = require('webpack');

module.exports = {
  entry: {
    app: './front/js/app.js',
    static: './front/js/static.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'src/main/resources/META-INF/resources/dist')
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
