/* eslint-disable */
const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

const roots = [
  path.join(__dirname, 'node_modules'), 'node_modules'
];

module.exports = () => { 
  return {
    entry: {
      'formula-editor-showcase': ['./index.js'],
    },
    resolve: {
      modules: roots
    },
    module: {
      rules: [
        {
          test: /\.(js|ts)$/,
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: [
              ["@babel/plugin-proposal-decorators", { loose: true, decoratorsBeforeExport: true, legacy:false }],
              ["@babel/plugin-proposal-class-properties", { loose: true }],
              ["@babel/plugin-proposal-object-rest-spread", { loose: true }],
              ["@babel/plugin-transform-react-jsx", { loose: true }],
              ["@babel/plugin-proposal-private-methods", { loose: true }],
              ["@babel/plugin-proposal-private-property-in-object", { loose: true }],
            ],
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
        {
          test: /\.scss$/i,
          oneOf: [
            {
              test: /\.module\.s?css$/,
              use: [
                { loader: "style-loader" },
                {
                  loader: "css-loader",
                  options: { modules: true },
                },
                { loader: "sass-loader" },
              ],
            },
            {
              use: [
                { loader: "to-string-loader" },
                { loader: "css-loader" },
                { loader: "sass-loader" },
              ],
            },
          ],
        },
        {
          test: /\.svg$/,
          use: [
            {
              loader: "svg-url-loader",
              options: {
                limit: 10000,
              },
            },
          ],
        },
        {
          test: /\.png$/,
          use: [{ loader: "url-loader", options: { limit: 10000 } }],
        },
        {
          test: new RegExp('./node_modules/lit-element-router/utility/router-utility.js'),
          loader: 'string-replace-loader',
          options: {
            search: /\[\\\\w\\u00C0-\\u00D6\\u00D8-\\u00f6\\u00f8-\\u00ff-\]/,
            replace: '[^\/]',
            strict: true,
          },
        },
      ],
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
      new HtmlWebpackPlugin({ template: 'index.html', baseUrl: '/' }),
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin([{ from: 'node_modules/@webcomponents/webcomponentsjs/**/*.js', to: './', context: './', }]),
      new CopyWebpackPlugin([{ from: 'node_modules/web-animations-js/*.js', to: './', context: './', }]),
    ],
    mode: 'development',
    devtool: 'source-map'
  };
};
