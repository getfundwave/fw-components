const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack'); // to access built-in plugins
const roots = [
  path.join(__dirname, 'node_modules'),'node_modules'
];

module.exports = (env) => { return {
  entry: {
    'crud-showcase': ['./index.js'],
  },
  resolve: {
    modules: roots
  },
  module: {
    rules: [
        {
            test: /\.js$/,
            loader: 'babel-loader',
            query: {
                presets: ['@babel/preset-env'],
                plugins: ['@babel/plugin-proposal-object-rest-spread','@babel/plugin-transform-react-jsx']
            }
        },
        {
          test: /\.[s][ac]ss$/i,
          use: ['to-string-loader','style-loader', 'css-loader', 'sass-loader'],
        }
    ]
  },
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
    contentBase: path.join(__dirname, './dist'),
    compress: true,
    port: 8080,
    historyApiFallback: true,
    hot: true
  },
  plugins: [
    new HtmlWebpackPlugin({ template: 'index.html',   baseUrl: '/'}),
    new webpack.ProgressPlugin(),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin([{from: 'node_modules/@webcomponents/webcomponentsjs/**/*.js',to: './',context: './',},]),
    new CopyWebpackPlugin([{from: 'node_modules/web-animations-js/*.js',to: './',context: './',},]),
  ],
  mode: 'development',
  devtool: 'source-map'
 }
};
