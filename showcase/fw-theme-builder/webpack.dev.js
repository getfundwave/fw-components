const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const webpack = require("webpack"); // to access built-in plugins
const roots = [path.join(__dirname, "node_modules"), "node_modules"];

module.exports = (env) => {
  return {
    entry: {
      index: "./index.js",
    },
    resolve: {
      extensions: [".ts", ".js"],
      modules: roots,
      alias: {
        "./src": false,
      },
    },
    module: {
      rules: [
        {
          test: /\.js$/,
          loader: "esbuild-loader",
          options: {
            loader: "jsx",
            target: "es2015",
          },
        },
        {
          test: /\.css$/i,
          use: ["style-loader", "css-loader"],
        },
      ],
    },
    output: {
      filename: "main.js",
      path: path.resolve(__dirname, "dist"),
    },
    devServer: {
      static: path.join(__dirname, "./dist"),
      compress: true,
      port: 8080,
      historyApiFallback: true,
      hot: true,
    },
    plugins: [
      new HtmlWebpackPlugin({ template: "index.html", baseUrl: "/" }),
      new webpack.ProgressPlugin(),
      new CleanWebpackPlugin(),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "node_modules/@webcomponents/webcomponentsjs/**/*.js",
            to: "./",
            context: "./",
          },
        ],
      }),
      new CopyWebpackPlugin({
        patterns: [
          {
            from: "node_modules/@fw-components/**/*.js",
            to: "./",
            context: "./",
          },
        ],
      })
    ],
    mode: "development",
    devtool: "source-map",
  };
};
