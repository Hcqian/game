const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin')
const {
    CleanWebpackPlugin
} = require("clean-webpack-plugin")

let srcPath = path.resolve(__dirname, 'src')
let files = fs.readdirSync(srcPath).filter(file=>fs.existsSync(path.join(srcPath, file+'/assets')))
let patterns = []
files.forEach(
    file=>patterns.push({from:'src/'+file+'/assets',to:file+'/assets'})
)

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
            patterns: patterns
            //     [
            //     { from: 'src/2048/assets', to: '2048/assets' },
            //     { from: 'src/flappybird/assets', to: 'flappybird/assets' },
            //     { from: 'src/jump/assets', to: 'jump/assets' }
            // ]
        })]

};