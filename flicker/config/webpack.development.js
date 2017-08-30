/**
 * @author Jang Jeong Sik (django)
 * @module webpack development config
 */

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const htmlWebpackPlugin = require('html-webpack-plugin');
const root = process.cwd();

const config = function(){
    console.log('building DEVELOPMENT !!');

    return webpackMerge(baseConfig(), {
        devtool : 'inline-source-map',
        plugins : [
            new webpack.optimize.OccurrenceOrderPlugin(),
            new webpack.HotModuleReplacementPlugin(),
            new webpack.NoEmitOnErrorsPlugin(),
            new htmlWebpackPlugin({
                filename: 'index.html',
                template: '../index.html',
                inject: true
            })
        ]
    });
};

module.exports = config;