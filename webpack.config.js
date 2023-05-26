const HtmlWebpackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");

module.exports = {
  entry: "./src/app.ts",
  output: {
    filename: "./bundle.js",
    assetModuleFilename: "files/[hash][ext][query]",
    clean: true,
  },

  performance: {
    maxAssetSize: 5000000,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
      inject: true,
      minify: {
        collapseWhitespace: true,
        removeComments: true,
        removeRedundantAttributes: true,
        removeScriptTypeAttributes: true,
        removeStyleLinkTypeAttributes: true,
        useShortDoctype: true,
      },
    }),
    new MiniCssExtractPlugin(),
  ],
  module: {
    rules: [
      { test: /\.ts$/, loader: "ts-loader" },
      { test: /\.js$/, loader: "source-map-loader" },
      {
        test: /\.json$/,
        type: "json",
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.(png|ico|pdf)$/,
        type: "asset/resource",
      },
    ],
  },
  mode: "production",
  optimization: {
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), "..."],
  },
};
