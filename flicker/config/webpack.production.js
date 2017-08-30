/**
 * @author Jang Jeong Sik (django)
 * @module webpack development config
 */

const webpack = require('webpack');
const webpackMerge = require('webpack-merge');
const baseConfig = require('./webpack.base.js');

const config = function(){
    console.log('building PRODUCTION !!');

    return webpackMerge(baseConfig(), {
        devtool : 'cheap-module-source-map',
        plugins : [
            new webpack.optimize.MinChunkSizePlugin({
                minChunkSize: Infinity
            }),

            new webpack.DefinePlugin({
                'process.env' : {
                    NODE_ENV : JSON.stringify('production')
                }
            }),

            new webpack.optimize.UglifyJsPlugin({
                sourceMap : true,
                compress: {
                    unused : true
                },
                mangle : false,
                beautify : true,
                output : {
                    comments : true
                }
            })
        ]
    });
};

module.exports = config;