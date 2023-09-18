const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {
    CleanWebpackPlugin
} = require("clean-webpack-plugin")

module.exports = {
    entry: './src/index.ts',
    mode:"none",
    devtool: 'source-map',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },
    module: {
        rules: [
            {
                test: /\.ts?$/,
                exclude: /node_modules/,
                use: 'ts-loader',
            }
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
    },
    // devServer: {
    //     historyApiFallback: true,
    //     allowedHosts: 'all',
    //     static: {
    //         directory: path.resolve(__dirname, "./dist"),
    //     },
    //     open: true,
    //     hot: true,
    //     port: 8000,
    // }
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({title: "Game"}),
        new CopyWebpackPlugin({
            patterns: [
                { from: 'src/2048/assets', to: 'assets' }
            ]
        })]

};