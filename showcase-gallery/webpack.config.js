import { join, resolve as _resolve } from "path";
import HtmlWebpackPlugin from "html-webpack-plugin";
import { CleanWebpackPlugin } from "clean-webpack-plugin";
import CopyWebpackPlugin from "copy-webpack-plugin";
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default (env, argv) => ({
  mode: "development",
  entry: {
    app: "./src/showcase-gallery.ts",
  },
  devServer: {
    contentBase: join(__dirname, "dist"),
    historyApiFallback: true,
  },
  devtool: "inline-source-map",
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template: "./index.html",
    }),
    new CopyWebpackPlugin([
      {
        context: "node_modules/@webcomponents/webcomponentsjs",
        from: "**/*.js",
        to: "webcomponents",
      },
      {
        from: "./src/assets/img/*",
        to: "./",
        flatten: true,
      },
    ]),
  ],
  output: {
    filename: "[name].bundle.js",
    path: _resolve(__dirname, "../docs"),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        include: _resolve(__dirname, "src"),
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.s[a|c]ss$/,
        use: [
          { loader: "style-loader" },
          { loader: "css-loader" },
          { loader: "sass-loader" },
        ],
      },
      {
        test: /\.(png|gif|jpg|cur)$/i,
        loader: "url-loader",
        options: { limit: 8192 },
      },
      {
        test: /\.woff2(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "url-loader",
        options: { limit: 10000, mimetype: "application/font-woff2" },
      },
      {
        test: /\.woff(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "url-loader",
        options: { limit: 10000, mimetype: "application/font-woff" },
      },
      {
        test: /\.(ttf|eot|svg|otf)(\?v=[0-9]\.[0-9]\.[0-9])?$/i,
        loader: "file-loader",
      },
    ],
  },
  node: {
    __dirname: "mock",
  },
  resolve: {
    extensions: [".tsx", ".ts", ".js"],
  },
});
