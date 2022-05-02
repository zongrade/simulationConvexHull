const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
module.exports = {
  mode: 'development',
  devtool: 'source-map',
  entry: path.resolve(__dirname, '../src/index.tsx'),
  resolve: {
    extensions: ['.tsx', '.ts', '.js', '.scss'],
  },
  output: {
    filename: '[name].[fullhash].js',
    path: path.resolve(__dirname, '../docs'),
    clean: true,
    publicPath: process.env.NODE_ENV == 'prod' ? './' : '/',
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
    }),
    new MiniCssExtractPlugin(),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, './src'),
          to: path.resolve(__dirname, './docs'),
          noErrorOnMissing: true,
        },
      ],
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(ts|js)x?$/,
        exclude: /node_modules/,
        use: [
          {
            loader: 'babel-loader',
          },
        ],
      },
      {
        test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          'style-loader',
          'css-modules-typescript-loader',
          'css-loader',
          'sass-loader',
        ],
      },
    ],
  },
  devServer: {
    compress: true,
    port: 3020,
    historyApiFallback: true,
  },
}
